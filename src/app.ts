import { loggStream } from './logging';

import bodyParser = require('body-parser');
import express = require('express');
import helmet = require('helmet');
import morgan = require('morgan');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('tiny', { stream: loggStream }));

app.get('/', (req, res) => res.send('hi'));

export default app;
