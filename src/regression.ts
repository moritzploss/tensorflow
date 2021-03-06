import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';

import { Model, ValidationData } from './types';

import { loadInputs } from './services/data';
import { createLayersModel, applyModel, saveModel, trainModel, getModelMetaData } from './services/model';
import { unNormalize, toNormTensor } from './util/tensors';

const createTrainedRegressionModel = async (logPath: string): Promise<Model> => {
  const { horsepowers, mpgs } = await loadInputs();
  const { normTensor: normInputs, min: inputMax, max: inputMin } = toNormTensor(horsepowers);
  const { normTensor: normLabels, min: labelMin, max: labelMax } = toNormTensor(mpgs);
  const metaData = { inputMin, inputMax, labelMin, labelMax };

  const model = createLayersModel();
  await trainModel(model, normInputs, normLabels, logPath);
  return { model, metaData };
};

const validateModel = async (path: string): Promise<ValidationData> => {
  const model = await tf.loadLayersModel(`file://${path}/model.json`);
  const { inputMin, inputMax, labelMin, labelMax } = await getModelMetaData(path);

  const normValidationInputs = tf.linspace(0, 1, 100).reshape([100, 1]);
  const normValidationResults = applyModel(model, normValidationInputs);
  const validationInputs = unNormalize(normValidationInputs, inputMin, inputMax).dataSync();
  const validationResults = unNormalize(normValidationResults, labelMin, labelMax).dataSync();
  return { validationInputs, validationResults };
};

const createAndValidateModel = async (): Promise<ValidationData> => {
  const { model, metaData } = await createTrainedRegressionModel('./tensorboard/regression/');
  await saveModel(model, metaData, './models/regression');
  return validateModel('./models/regression');
};


const saveValidationData = ({ validationInputs, validationResults }): void => {
  fs.writeFile(
    './data/regressionValidation.json',
    JSON.stringify({
      validationInputs: Array.from(validationInputs),
      validationResults: Array.from(validationResults),
    }),
    (err) => console.log(err),
  );
};

createAndValidateModel().then(saveValidationData);
