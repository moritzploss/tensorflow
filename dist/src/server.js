"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var logging_1 = require("./logging");
app_1.default.listen(process.env.PORT);
var time = new Date().toLocaleTimeString();
var address = "http://localhost:" + process.env.PORT;
logging_1.logger.info("started at " + time + " at " + address);
