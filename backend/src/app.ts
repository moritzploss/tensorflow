import router from './routes';
import { loggStream } from './logging';

import express = require('express');
import morgan = require('morgan');
import helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(morgan('tiny', { stream: loggStream }));
app.use('/', router);

export default app;
