/* eslint-disable @typescript-eslint/no-var-requires */
const { expect } = require('chai');
const tf = require('@tensorflow/tfjs-node');

const { normalize, unNormalize } = require('../dist/util/tensors');

describe('the normalize function', () => {
  it('should return values in the range of 0 to 1', () => {
    const tensor = tf.linspace(-10, 10, 100);
    const { min, max, normTensor } = normalize(tensor);
    expect(normTensor.min().dataSync()[0]).to.equal(0);
    expect(normTensor.max().dataSync()[0]).to.equal(1);
  });

  it('should find the minimum and maximum values', () => {
    const tensor = tf.linspace(-10, 5, 100);
    const { min, max, normTensor } = normalize(tensor);
    expect(min.dataSync()[0]).to.equal(-10);
    expect(max.dataSync()[0]).to.equal(5);
  });
});

describe('the unNormalize function', () => {
  it('should return values in the range of the specified min and max', () => {
    const normTensor = tf.linspace(0, 1, 100);
    const tensor = unNormalize(normTensor, tf.tensor([-10]), tf.tensor([5]));
    expect(tensor.min().dataSync()[0]).to.equal(-10);
    expect(tensor.max().dataSync()[0]).to.equal(5);
  });
});
