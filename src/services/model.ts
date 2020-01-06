import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import * as util from 'util';

import { ModelMetaData } from '../types';

const createSequentialModel = (): tf.Sequential => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));
  model.add(tf.layers.dense({ units: 1, useBias: true }));
  return model;
};

const applyModel = (model, inputs: tf.Tensor): tf.Tensor<tf.Rank> => model.predict(inputs);

const saveModel = async (model: tf.LayersModel, metaData: ModelMetaData, path: string): Promise<void> => {
  await model.save(`file://${path}`);
  fs.writeFileSync(`${path}/meta.json`, JSON.stringify({
    inputMin: metaData.inputMin.dataSync()['0'],
    inputMax: metaData.inputMax.dataSync()['0'],
    labelMin: metaData.labelMin.dataSync()['0'],
    labelMax: metaData.labelMax.dataSync()['0'],
  }));
};

const trainModel = async (model: tf.Sequential, inputs: tf.Tensor, labels: tf.Tensor, logPath: string): Promise<tf.History> => {
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  });

  return model.fit(inputs, labels, {
    batchSize: 32,
    epochs: 50,
    shuffle: true,
    callbacks: tf.node.tensorBoard(logPath),
  });
};

const readFile = util.promisify(fs.readFile);

const getModelMetaData = async (path: string): Promise<ModelMetaData> => {
  console.log('trying to read file');
  const metaBuffer = await readFile(`${path}/meta.json`);
  console.log('read file');
  const metaData = JSON.parse(metaBuffer.toString());
  return {
    inputMin: tf.tensor(metaData.inputMin),
    inputMax: tf.tensor(metaData.inputMax),
    labelMin: tf.tensor(metaData.labelMin),
    labelMax: tf.tensor(metaData.labelMax),
  };
};

export {
  applyModel,
  createSequentialModel,
  getModelMetaData,
  saveModel,
  trainModel,
};
