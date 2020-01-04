require('@tensorflow/tfjs-node-gpu');

import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import fetch from 'node-fetch';

interface Car {
  mpg: number;
  horsepower: number;
}

interface CarData {
  Miles_per_Gallon: string;
  Horsepower: string;
}

const isComplete = (car: Car): boolean => (car.mpg != null && car.horsepower != null);

const toCar = (carData: CarData): Car => ({
  mpg: Number(carData.Miles_per_Gallon),
  horsepower: Number(carData.Horsepower),
});

const getData = async (): Promise<Car[]> => {
  const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
  const carsData = await carsDataReq.json();
  return carsData
    .map(toCar)
    .filter(isComplete);
};

const createSequentialModel = (): tf.Sequential => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));
  model.add(tf.layers.dense({ units: 1, useBias: true }));
  return model;
};

const normalize = (tensor: tf.Tensor) => {
  const min = tensor.min();
  const max = tensor.max();
  const normTensor = tensor.sub(min).div(max.sub(min));

  return { min, max, normTensor };
};

const unNormalize = (tensor: tf.Tensor, min: tf.Tensor, max: tf.Tensor): tf.Tensor => tensor
  .mul(max.sub(min))
  .add(min);

const convertToTensor = (cars: Car[]) => (
  tf.tidy(() => {
    tf.util.shuffle(cars);

    const inputs = cars.map((car: Car) => car.horsepower);
    const labels = cars.map((car: Car) => car.mpg);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    const { normTensor: normInputs, min: inputMin, max: inputMax } = normalize(inputTensor);
    const { normTensor: normLabels, min: labelMin, max: labelMax } = normalize(labelTensor);

    return {
      inputMin,
      inputMax,
      normInputs,
      labelMin,
      labelMax,
      normLabels,
    };
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
  });
};


const applyModel = (model, inputs: tf.Tensor): tf.Tensor<tf.Rank> => model.predict(inputs);

const run = async (): Promise<void> => {
  const data = await getData();
  const { normInputs, inputMax, inputMin, normLabels, labelMin, labelMax } = convertToTensor(data);

  const model = createSequentialModel();
  await trainModel(model, normInputs, normLabels);

  const normValidationInputs = tf.linspace(0, 1, 100).reshape([100, 1]);
  const normValidationResults = applyModel(model, normValidationInputs);
  const validationInputs = unNormalize(normValidationInputs, inputMin, inputMax).dataSync();
  const validationResults = unNormalize(normValidationResults, labelMin, labelMax).dataSync();
  console.log(validationInputs[50], validationResults[50]);
};

run();
