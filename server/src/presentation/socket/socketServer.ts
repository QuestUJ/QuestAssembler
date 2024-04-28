import {
    ClientToServerEvents,
    InternalEvents,
    QuasmComponent,
    ServerToClientEvents,
    SocketData
} from '@quasm/common';
import { type Server, Socket } from 'socket.io';

import { IAuthProvider } from '@/domain/tools/auth-provider/IAuthProvider';
import { logger } from '@/infrastructure/logger/Logger';

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
    authProvider: IAuthProvider
) {
    logger.info(QuasmComponent.SOCKET, 'Socket.io attached');

    io.use(auth(authProvider));

    io.on('connection', socket => {
        logger.info(
            QuasmComponent.SOCKET,
            `Received connection from : ${socket.id}`
        );

        // socket.on('msg', data => {
        //     logger.info('Socket.io Server', `Received message: ${data}`);
        //
        //     setTimeout(() => {
        //         socket.emit('msg', `Copy that!: ${data}`);
        //     }, 1000);
        // });
        //
        // socket.on('msg', data => {
        //     console.log(data);
        // });
    });
}

declare module 'fastify' {
    interface FastifyInstance {
        io: QuasmSocketServer;
    }
}
