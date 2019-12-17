import { logger } from '../logging';

export const onConnection = (ws, req) => {
  logger.info('connection opened');
  return ws.send('welcome');
};

export const onMessage = (ws, req) => {
  return logger.info('message received');
};

export const onClose = (ws, req) => {
  return logger.info('connection closed');
};
