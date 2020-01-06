import fetch from 'node-fetch';

import { Car, CarData } from '../types';

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

export { loadInputs };
