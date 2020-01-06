"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var util = require("util");
exports.readFile = util.promisify(fs.readFile);
