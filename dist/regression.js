"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-node");
var node_fetch_1 = require("node-fetch");
var tensorBoardPath = './tensorboard/regression/';
var dataIsComplete = function (car) { return (car.mpg != null && car.horsepower != null); };
var toCar = function (carData) { return ({
    mpg: Number(carData.Miles_per_Gallon),
    horsepower: Number(carData.Horsepower),
}); };
var getData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var carsDataReq, carsData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, node_fetch_1.default('https://storage.googleapis.com/tfjs-tutorials/carsData.json')];
            case 1:
                carsDataReq = _a.sent();
                return [4 /*yield*/, carsDataReq.json()];
            case 2:
                carsData = _a.sent();
                return [2 /*return*/, carsData
                        .map(toCar)
                        .filter(dataIsComplete)];
        }
    });
}); };
var loadInputs = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, horsepowers, mpgs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getData()];
            case 1:
                data = _a.sent();
                horsepowers = data.map(function (car) { return car.horsepower; });
                mpgs = data.map(function (car) { return car.mpg; });
                return [2 /*return*/, { horsepowers: horsepowers, mpgs: mpgs }];
        }
    });
}); };
var createSequentialModel = function () {
    var model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));
    model.add(tf.layers.dense({ units: 1, useBias: true }));
    return model;
};
var normalize = function (tensor) {
    var min = tensor.min();
    var max = tensor.max();
    var normTensor = tensor.sub(min).div(max.sub(min));
    return { min: min, max: max, normTensor: normTensor };
};
var unNormalize = function (tensor, min, max) { return tensor
    .mul(max.sub(min))
    .add(min); };
var toNormTensor = function (dataArray) { return (tf.tidy(function () {
    tf.util.shuffle(dataArray);
    var tensor = tf.tensor2d(dataArray, [dataArray.length, 1]);
    var _a = normalize(tensor), normTensor = _a.normTensor, min = _a.min, max = _a.max;
    return { normTensor: normTensor, min: min, max: max };
})); };
var trainModel = function (model, inputs, labels) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        model.compile({
            optimizer: tf.train.adam(),
            loss: tf.losses.meanSquaredError,
            metrics: ['mse'],
        });
        return [2 /*return*/, model.fit(inputs, labels, {
                batchSize: 32,
                epochs: 50,
                shuffle: true,
                callbacks: tf.node.tensorBoard(tensorBoardPath),
            })];
    });
}); };
var applyModel = function (model, inputs) { return model.predict(inputs); };
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, horsepowers, mpgs, _b, normInputs, inputMax, inputMin, _c, normLabels, labelMin, labelMax, model, loadedModel, normValidationInputs, normValidationResults, validationInputs, validationResults;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, loadInputs()];
            case 1:
                _a = _d.sent(), horsepowers = _a.horsepowers, mpgs = _a.mpgs;
                _b = toNormTensor(horsepowers), normInputs = _b.normTensor, inputMax = _b.min, inputMin = _b.max;
                _c = toNormTensor(mpgs), normLabels = _c.normTensor, labelMin = _c.min, labelMax = _c.max;
                model = createSequentialModel();
                return [4 /*yield*/, trainModel(model, normInputs, normLabels)];
            case 2:
                _d.sent();
                return [4 /*yield*/, model.save('file://./models/regression')];
            case 3:
                _d.sent();
                return [4 /*yield*/, tf.loadLayersModel('file://./models/regression/model.json')];
            case 4:
                loadedModel = _d.sent();
                normValidationInputs = tf.linspace(0, 1, 100).reshape([100, 1]);
                normValidationResults = applyModel(loadedModel, normValidationInputs);
                validationInputs = unNormalize(normValidationInputs, inputMin, inputMax).dataSync();
                validationResults = unNormalize(normValidationResults, labelMin, labelMax).dataSync();
                console.log(validationInputs[50], validationResults[50]);
                return [2 /*return*/];
        }
    });
}); };
run();
