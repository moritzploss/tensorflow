import fetch from 'node-fetch';
import * as fs from 'fs';

import { Car, CarData } from '../types';

const dataIsComplete = (car: Car): boolean => (car.mpg != null && car.horsepower != null);

const dataIsNotZero = (car: Car): boolean => car.mpg !== 0 && car.horsepower !== 0;

const toCar = (carData: CarData): Car => ({
  mpg: Number(carData.Miles_per_Gallon),
  horsepower: Number(carData.Horsepower),
});

const getData = async (): Promise<Car[]> => {
  const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
  const carsData = await carsDataReq.json();
  return carsData
    .map(toCar)
    .filter(dataIsComplete)
    .filter(dataIsNotZero);
};

const saveData = (dataSerializable) => {
  fs.writeFile(
    './data/regressionInput.json',
    JSON.stringify(dataSerializable),
    (err) => console.log(err),
  );
};

const loadInputs = async () => {
  const data = await getData();
  const horsepowers = data.map((car: Car) => car.horsepower);
  const mpgs = data.map((car: Car) => car.mpg);

  const inputData = { horsepowers, mpgs };
  saveData(inputData);
  return inputData;
};

export { loadInputs };
