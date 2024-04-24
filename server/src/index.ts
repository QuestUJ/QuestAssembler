import 'dotenv/config';

import { extractMessage } from '@quasm/common';

import { config } from './config';
import { logger } from './infrastructure/logger/Logger';
import { db } from './infrastructure/postgres/db';
import { startHTTPServer } from './presentation/http/httpServer';
import {
    QuasmSocketServer,
    startSocketServer
} from './presentation/socket/socketServer';
import { RoomRepositoryPostgres } from './repositories/room/RoomRepositoryPostgres';

const { PORT } = config.pick(['PORT']);
const roomRepo = new RoomRepositoryPostgres(db);

(async () => {
    const app = await startHTTPServer();
    startSocketServer(app.io, roomRepo);

    await app.listen({ port: PORT });

    logger.info('STARTUP', 'Successful!');
})().catch(err => logger.error('STARTUP', extractMessage(err)));

declare module 'fastify' {
    interface FastifyInstance {
        io: QuasmSocketServer;
    }
}
