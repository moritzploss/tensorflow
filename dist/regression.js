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
var data_1 = require("./services/data");
var model_1 = require("./services/model");
var normalize_1 = require("./tensors/normalize");
var createTrainedRegressionModel = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, horsepowers, mpgs, _b, normInputs, inputMax, inputMin, _c, normLabels, labelMin, labelMax, metaData, model;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, data_1.loadInputs()];
            case 1:
                _a = _d.sent(), horsepowers = _a.horsepowers, mpgs = _a.mpgs;
                _b = normalize_1.toNormTensor(horsepowers), normInputs = _b.normTensor, inputMax = _b.min, inputMin = _b.max;
                _c = normalize_1.toNormTensor(mpgs), normLabels = _c.normTensor, labelMin = _c.min, labelMax = _c.max;
                metaData = { inputMin: inputMin, inputMax: inputMax, labelMin: labelMin, labelMax: labelMax };
                model = model_1.createSequentialModel();
                return [4 /*yield*/, model_1.trainModel(model, normInputs, normLabels, './tensorboard/regression/')];
            case 2:
                _d.sent();
                return [2 /*return*/, { model: model, metaData: metaData }];
        }
    });
}); };
var validateModel = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var model, _a, inputMin, inputMax, labelMin, labelMax, normValidationInputs, normValidationResults, validationInputs, validationResults;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, tf.loadLayersModel("file://" + path + "/model.json")];
            case 1:
                model = _b.sent();
                return [4 /*yield*/, model_1.getModelMetaData(path)];
            case 2:
                _a = _b.sent(), inputMin = _a.inputMin, inputMax = _a.inputMax, labelMin = _a.labelMin, labelMax = _a.labelMax;
                normValidationInputs = tf.linspace(0, 1, 100).reshape([100, 1]);
                normValidationResults = model_1.applyModel(model, normValidationInputs);
                validationInputs = normalize_1.unNormalize(normValidationInputs, inputMin, inputMax).dataSync();
                validationResults = normalize_1.unNormalize(normValidationResults, labelMin, labelMax).dataSync();
                return [2 /*return*/, { validationInputs: validationInputs, validationResults: validationResults }];
        }
    });
}); };
var createAndValidateModel = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, model, metaData, _b, validationInputs, validationResults;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, createTrainedRegressionModel()];
            case 1:
                _a = _c.sent(), model = _a.model, metaData = _a.metaData;
                return [4 /*yield*/, model_1.saveModel(model, metaData, path)];
            case 2:
                _c.sent();
                return [4 /*yield*/, validateModel(path)];
            case 3:
                _b = _c.sent(), validationInputs = _b.validationInputs, validationResults = _b.validationResults;
                console.log(validationInputs[50], validationResults[50]);
                return [2 /*return*/];
        }
    });
}); };
createAndValidateModel('./models/regression');
