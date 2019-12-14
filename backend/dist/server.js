"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
app_1.default.listen(process.env.PORT);
if (process.env.NODE_ENV !== 'production') {
    process.stdout.write("restarted at " + new Date().toLocaleTimeString() + "\n");
    process.stdout.write("http://localhost:" + process.env.PORT + "\n");
}
