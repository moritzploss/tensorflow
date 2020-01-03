import app from './app';
import { logger } from './logging';

app.listen(process.env.PORT);

const time = new Date().toLocaleTimeString();
const address = `http://localhost:${process.env.PORT}`;
logger.info(`started at ${time} at ${address}`);
