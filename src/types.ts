import * as tf from '@tensorflow/tfjs-node';

export interface Car {
  mpg: number;
  horsepower: number;
}

export interface CarData {
  Miles_per_Gallon: string;
  Horsepower: string;
}

export interface Model {
  model: tf.LayersModel;
  metaData: ModelMetaData;
}

export interface ModelMetaData {
  inputMin: tf.Tensor;
  inputMax: tf.Tensor;
  labelMin: tf.Tensor;
  labelMax: tf.Tensor;
}

export interface NormTensorData {
  min: tf.Tensor;
  max: tf.Tensor;
  normTensor: tf.Tensor;
}
