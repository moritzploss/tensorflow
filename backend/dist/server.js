"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
app_1.default.listen(process.env.PORT);
if (process.env.NODE_ENV !== 'production') {
    var time = new Date().toLocaleTimeString();
    var address = "http://localhost:" + process.env.PORT + "\n";
    process.stdout.write("started at " + time + " at " + address);
}
