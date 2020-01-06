"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-node");
var normalize = function (tensor) {
    var min = tensor.min();
    var max = tensor.max();
    var normTensor = tensor.sub(min).div(max.sub(min));
    return { min: min, max: max, normTensor: normTensor };
};
var unNormalize = function (tensor, min, max) { return tensor
    .mul(max.sub(min))
    .add(min); };
exports.unNormalize = unNormalize;
var toNormTensor = function (dataArray) { return (tf.tidy(function () {
    tf.util.shuffle(dataArray);
    var tensor = tf.tensor2d(dataArray, [dataArray.length, 1]);
    var _a = normalize(tensor), normTensor = _a.normTensor, min = _a.min, max = _a.max;
    return { normTensor: normTensor, min: min, max: max };
})); };
exports.toNormTensor = toNormTensor;
