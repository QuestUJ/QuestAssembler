import {
    ClientToServerEvents,
    InternalEvents,
    ServerToClientEvents,
    SocketData
} from '@quasm/common';
import { type Server, Socket } from 'socket.io';

import { config } from '@/config';
import { User } from '@/domain/game/User';
import { Auth0Provider } from '@/domain/tools/auth-provider/Auth0Provider';
import { logger } from '@/infrastructure/logger/Logger';
import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { auth } from './middlewares/auth';

const { AUTH0_DOMAIN, AUTH0_AUDIENCE } = config.pick([
    'AUTH0_DOMAIN',
    'AUTH0_AUDIENCE'
]);

export type QuasmSocketServer = Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InternalEvents,
    SocketData
>;

export type QuasmSocket = Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InternalEvents,
    SocketData
>;

export function startSocketServer(
    io: QuasmSocketServer,
    roomRepository: IRoomRepository
) {
    const authProvider = new Auth0Provider({
        domain: AUTH0_DOMAIN,
        audience: AUTH0_AUDIENCE
    });

    io.use(auth(authProvider));

    logger.info('Socket.io Server', 'Socket.io attached');

    io.on('connection', socket => {
        logger.info(
            'Socket.io Server',
            `Received connection from : ${socket.id}`
        );

        new User(socket, socket.data.user, roomRepository);
    });
}
