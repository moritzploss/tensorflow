"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = require("../logging");
exports.onConnection = function (ws, req) {
    logging_1.logger.info('connection opened');
    ws.send('welcome');
};
exports.onMessage = function (ws, req) {
    logging_1.logger.info('message received');
};
exports.onClose = function (ws, req) {
    logging_1.logger.info('connection closed');
};
