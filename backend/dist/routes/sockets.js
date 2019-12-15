"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var expressWs = require("express-ws");
expressWs(express());
var socketsRouter = express.Router();
socketsRouter.ws('/', function (ws) { return ws.send('hello'); });
exports.default = socketsRouter;
