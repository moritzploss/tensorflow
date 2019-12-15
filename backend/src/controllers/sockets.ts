import { logger } from '../logging';

export const onConnection = (ws, req) => {
  logger.info('connection opened');
  ws.send('welcome');
};

export const onMessage = (ws, req) => {
  logger.info('message received');
};

export const onClose = (ws, req) => {
  logger.info('connection closed');
};
