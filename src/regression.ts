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

const toCar = (car: CarData): Car => ({
  mpg: Number(car.Miles_per_Gallon),
  horsepower: Number(car.Horsepower),
});

const getData = async (): Promise<Car[]> => {
  const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
  const carsData = await carsDataReq.json();
  return carsData
    .map(toCar)
    .filter(isComplete);
};

const run = async () => {
  const data = await getData();


  // More code will be added below
};

const createSequentialModel = (): tf.Sequential => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));
  model.add(tf.layers.dense({ units: 1, useBias: true }));
  return model;
};

run();
const model = createSequentialModel();

const convertToTensor = (cars: Car[]) => (
  tf.tidy(() => {
    tf.util.shuffle(cars);

    const inputs = cars.map((car: Car) => car.horsepower);
    const labels = cars.map((car: Car) => car.mpg);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    };
  })
);

const trainModel = async (model, inputs, labels) => {
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  });

  const batchSize = 32;
  const epochs = 50;

  return model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'mse'],
      { height: 200, callbacks: ['onEpochEnd'] },
    ),
  });
};
