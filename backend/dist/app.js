"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = require("./logging");
var bodyParser = require("body-parser");
var express = require("express");
var helmet = require("helmet");
var morgan = require("morgan");
var expressWs = require("express-ws");
var wsInstance = expressWs(express());
var app = wsInstance.app;
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('tiny', { stream: logging_1.loggStream }));
app.ws('/sockets/clients/:id', function (ws, req) {
    console.log(req.params.id);
    ws.on('close', function () { return console.log('closed'); });
});
app.get('/login', function (req, res) { return res.send('hi'); });
exports.default = app;
