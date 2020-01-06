import * as tf from '@tensorflow/tfjs-node';

import { Model } from './types';

import { loadInputs  } from './services/data';
import { createSequentialModel, applyModel, saveModel, trainModel, getModelMetaData } from './services/model';
import { unNormalize, toNormTensor } from './tensors/normalize';

const createTrainedRegressionModel = async (): Promise<Model> => {
  const { horsepowers, mpgs } = await loadInputs();
  const { normTensor: normInputs, min: inputMax, max: inputMin } = toNormTensor(horsepowers);
  const { normTensor: normLabels, min: labelMin, max: labelMax } = toNormTensor(mpgs);
  const metaData = { inputMin, inputMax, labelMin, labelMax };

  const model = createSequentialModel();
  await trainModel(model, normInputs, normLabels, './tensorboard/regression/');
  return { model, metaData };
};

const validateModel = async (path: string) => {
  const model = await tf.loadLayersModel(`file://${path}/model.json`);
  const { inputMin, inputMax, labelMin, labelMax } = await getModelMetaData(path);

  const normValidationInputs = tf.linspace(0, 1, 100).reshape([100, 1]);
  const normValidationResults = applyModel(model, normValidationInputs);
  const validationInputs = unNormalize(normValidationInputs, inputMin, inputMax).dataSync();
  const validationResults = unNormalize(normValidationResults, labelMin, labelMax).dataSync();
  return { validationInputs, validationResults };
};

const createAndValidateModel = async (path: string): Promise<void> => {
  const { model, metaData } = await createTrainedRegressionModel();
  await saveModel(model, metaData, path);
  const { validationInputs, validationResults } = await validateModel(path);
  console.log(validationInputs[50], validationResults[50]);
};

createAndValidateModel('./models/regression');
