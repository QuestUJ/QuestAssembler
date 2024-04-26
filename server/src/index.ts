import 'dotenv/config';

import { extractMessage } from '@quasm/common';
import { Server } from 'socket.io';

import { config } from './config';
import { Auth0Provider } from './domain/tools/auth-provider/Auth0Provider';
import { logger } from './infrastructure/logger/Logger';
import { db } from './infrastructure/postgres/db';
import { startHTTPServer } from './presentation/http/httpServer';
import { startSocketServer } from './presentation/socket/socketServer';
import { RoomRepositoryPostgres } from './repositories/room/RoomRepositoryPostgres';

const { PORT, AUTH0_DOMAIN, AUTH0_AUDIENCE } = config.pick([
    'PORT',
    'AUTH0_DOMAIN',
    'AUTH0_AUDIENCE'
]);

(async () => {
    const roomRepo = new RoomRepositoryPostgres(db);
    const auth0 = new Auth0Provider({
        domain: AUTH0_DOMAIN,
        audience: AUTH0_AUDIENCE
    });

    const app = await startHTTPServer(roomRepo, auth0);
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
