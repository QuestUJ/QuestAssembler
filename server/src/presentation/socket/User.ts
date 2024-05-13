import { IAuthProvider } from '@/domain/tools/auth-provider/IAuthProvider';
import {
    QuasmSocket,
    QuasmSocketServer
} from '@/presentation/socket/socketServer';
import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { joinRoomHandler } from './handlers/joinRoom';
import { sendMessageHandler } from './handlers/sendMessage';
import { subscribeToRoomHandler } from './handlers/subscribeToRoom';

export class User {
    constructor(
        socket: QuasmSocket,
        io: QuasmSocketServer,
        dataAccess: DataAccessFacade,
        authProvider: IAuthProvider
    ) {
        joinRoomHandler({
            io,
            socket,
            dataAccess,
            authProvider
        });

        subscribeToRoomHandler({
            io,
            socket,
            dataAccess,
            authProvider
        });

        sendMessageHandler({
            io,
            socket,
            dataAccess,
            authProvider
        });
    }
}
