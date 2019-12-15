import * as wsController from '../controllers/sockets';

import express = require('express');
import expressWs = require('express-ws');

const wsInstance = expressWs(express());
const socketsRouter = express.Router();

wsInstance.getWss().on('connection', wsController.onConnection);

socketsRouter.ws('clients/:id', (ws) => {
  ws.on('message', wsController.onMessage);
  ws.on('close', wsController.onClose);
});

export default socketsRouter;
