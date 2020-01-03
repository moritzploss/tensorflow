"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wsController = require("../controllers/sockets");
var express = require("express");
var expressWs = require("express-ws");
var wsInstance = expressWs(express());
var socketsRouter = express.Router();
wsInstance.getWss().on('connection', function (ws) { return console.log('opened'); });
socketsRouter.ws('/clients/:id', function (ws, req) {
    console.log(req.params.id);
    ws.on('message', wsController.onMessage);
    ws.on('close', wsController.onClose);
});
exports.default = socketsRouter;
