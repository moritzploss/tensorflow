import * as tf from '@tensorflow/tfjs-node';
import fetch from 'node-fetch';


interface Car {
  mpg: number;
  horsepower: number;
}

interface CarData {
  Miles_per_Gallon: string;
  Horsepower: string;
}

interface NormTensorData {
  min: tf.Tensor;
  max: tf.Tensor;
  normTensor: tf.Tensor;
}

const tensorBoardPath = './tensorboard/regression/';

const dataIsComplete = (car: Car): boolean => (car.mpg != null && car.horsepower != null);

const toCar = (carData: CarData): Car => ({
  mpg: Number(carData.Miles_per_Gallon),
  horsepower: Number(carData.Horsepower),
});

const getData = async (): Promise<Car[]> => {
  const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
  const carsData = await carsDataReq.json();
  return carsData
    .map(toCar)
    .filter(dataIsComplete);
};

const loadInputs = async () => {
  const data = await getData();
  const horsepowers = data.map((car: Car) => car.horsepower);
  const mpgs = data.map((car: Car) => car.mpg);
  return { horsepowers, mpgs };
};

const createSequentialModel = (): tf.Sequential => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));
  model.add(tf.layers.dense({ units: 1, useBias: true }));
  return model;
};

const normalize = (tensor: tf.Tensor): NormTensorData => {
  const min = tensor.min();
  const max = tensor.max();
  const normTensor = tensor.sub(min).div(max.sub(min));
  return { min, max, normTensor };
};

const unNormalize = (tensor: tf.Tensor, min: tf.Tensor, max: tf.Tensor): tf.Tensor => tensor
  .mul(max.sub(min))
  .add(min);

const toNormTensor = (dataArray: number[]): NormTensorData => (
  tf.tidy(() => {
    tf.util.shuffle(dataArray);
    const tensor = tf.tensor2d(dataArray, [dataArray.length, 1]);
    const { normTensor, min, max } = normalize(tensor);
    return { normTensor, min, max };
  })
);

const trainModel = async (model: tf.Sequential, inputs: tf.Tensor, labels: tf.Tensor): Promise<tf.History> => {
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  });

  return model.fit(inputs, labels, {
    batchSize: 32,
    epochs: 50,
    shuffle: true,
    callbacks: tf.node.tensorBoard(tensorBoardPath),
  });
};

const applyModel = (model, inputs: tf.Tensor): tf.Tensor<tf.Rank> => model.predict(inputs);

const run = async (): Promise<void> => {
  const { horsepowers, mpgs } = await loadInputs();
  const { normTensor: normInputs, min: inputMax, max: inputMin } = toNormTensor(horsepowers);
  const { normTensor: normLabels, min: labelMin, max: labelMax } = toNormTensor(mpgs);

  const model = createSequentialModel();
  await trainModel(model, normInputs, normLabels);
  await model.save('file://./models/regression');

  const loadedModel = await tf.loadLayersModel('file://./models/regression/model.json');
  const normValidationInputs = tf.linspace(0, 1, 100).reshape([100, 1]);
  const normValidationResults = applyModel(loadedModel, normValidationInputs);
  const validationInputs = unNormalize(normValidationInputs, inputMin, inputMax).dataSync();
  const validationResults = unNormalize(normValidationResults, labelMin, labelMax).dataSync();
  console.log(validationInputs[50], validationResults[50]);
};

run();
