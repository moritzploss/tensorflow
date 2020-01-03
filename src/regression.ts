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
  // Load and plot the original input data that we are going to train on.
  const data = await getData();
  const values = data.map((car: Car) => ({
    x: car.horsepower,
    y: car.mpg,
  }));

  tfvis.render.scatterplot(
    { name: 'Horsepower v MPG' },
    { values },
    {
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300,
    },
  );

  // More code will be added below
};

run();
