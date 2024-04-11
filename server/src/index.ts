import 'dotenv/config';

import http from 'http';

import { config } from './config';
import { logger } from './infrastructure/logger/Logger';
import { app } from './presentation/httpServer';
import { startSocketServer } from './presentation/socketServer';

const { PORT } = config.pick(['PORT']);

const server = http.createServer(app);

startSocketServer(server);

server.listen(PORT, () => {
    logger.info('HTTP Server', `Running on port ${PORT}`);
});
