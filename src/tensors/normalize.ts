import * as tf from '@tensorflow/tfjs-node';

import { NormTensorData } from '../types';

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

export {
  toNormTensor,
  unNormalize,
};
