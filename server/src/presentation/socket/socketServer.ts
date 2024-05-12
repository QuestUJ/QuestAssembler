import {
    ClientToServerEvents,
    InternalEvents,
    QuasmComponent,
    ServerToClientEvents,
    SocketData
} from '@quasm/common';
import { type Server, Socket } from 'socket.io';

import { User } from '@/domain/game/User';
import { IAuthProvider } from '@/domain/tools/auth-provider/IAuthProvider';
import { logger } from '@/infrastructure/logger/Logger';
import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { auth } from './middlewares/auth';

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
    roomRepository: IRoomRepository,
    authProvider: IAuthProvider
) {
    logger.info(QuasmComponent.SOCKET, 'Socket.io attached');

    io.use(auth(authProvider));

    io.on('connection', socket => {
        logger.info(
            QuasmComponent.SOCKET,
            `Received connection from : ${socket.id}`
        );

        new User(socket, io, roomRepository, authProvider);
    });
}

declare module 'fastify' {
    interface FastifyInstance {
        io: QuasmSocketServer;
    }
}
