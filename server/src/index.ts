import 'dotenv/config';

import { extractMessage } from '@quasm/common';
import { Server } from 'socket.io';

import { config } from './config';
import { logger } from './infrastructure/logger/Logger';
import { startHTTPServer } from './presentation/http/httpServer';
import { startSocketServer } from './presentation/socket/socketServer';

const { PORT } = config.pick(['PORT']);

(async () => {
    const app = await startHTTPServer();
    startSocketServer(app.io);

    await app.listen({ port: PORT });

    logger.info('STARTUP', 'Successful!');
})().catch(err => logger.error('STARTUP', extractMessage(err)));

declare module 'fastify' {
    interface FastifyInstance {
        io: Server<{
            msg: string;
        }>;
    }
}
