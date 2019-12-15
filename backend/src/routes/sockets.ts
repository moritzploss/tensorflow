import express = require('express');
import expressWs = require('express-ws');

expressWs(express());
const socketsRouter = express.Router();

socketsRouter.ws('/', (ws) => ws.send('hello'));

export default socketsRouter;
