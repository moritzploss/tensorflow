import socketsRouter from './routes/sockets';
import { loggStream } from './logging';

import bodyParser = require('body-parser');
import express = require('express');
import helmet = require('helmet');
import morgan = require('morgan');
import expressWs = require('express-ws');

const wsInstance = expressWs(express());
const { app } = wsInstance;

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('tiny', { stream: loggStream }));

app.ws('/sockets/clients/:id', (ws, req) => {
  console.log(req.params.id);
  ws.on('close', () => console.log('closed'));
});

app.get('/login', (req, res) => res.send('hi'));

export default app;
