import {
    ClientToServerEvents,
    InternalEvents,
    QuasmComponent,
    ServerToClientEvents,
    SocketData
} from '@quasm/common';
import { type Server, Socket } from 'socket.io';

import { IAuthProvider } from '@/domain/tools/auth-provider/IAuthProvider';
import { IFileStorage } from '@/domain/tools/file-storage/IFileStorage';
import { logger } from '@/infrastructure/logger/Logger';
import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { auth } from './middlewares/auth';
import { User } from './User';

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
    dataAccess: DataAccessFacade,
    authProvider: IAuthProvider,
    fileStorageProvider: IFileStorage
) {
    logger.info(QuasmComponent.SOCKET, ['Socket.io attached']);

    io.use(auth(authProvider));

    io.on('connection', socket => {
        logger.info(QuasmComponent.SOCKET, [
            `Received connection from: ${socket.data.userID}`
        ]);

        new User(socket, io, dataAccess, authProvider, fileStorageProvider);
    });
}

declare module 'fastify' {
    interface FastifyInstance {
        io: QuasmSocketServer;
    }
}
