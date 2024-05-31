import { QuasmComponent } from '@quasm/common';
import chalk from 'chalk';

import { IAuthProvider } from '@/domain/tools/auth-provider/IAuthProvider';
import { IFileStorage } from '@/domain/tools/file-storage/IFileStorage';
import { logger } from '@/infrastructure/logger/Logger';
import {
    QuasmSocket,
    QuasmSocketServer
} from '@/presentation/socket/socketServer';
import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { changeCharacterSettingsHandler } from './handlers/changeCharacterSettings';
import { changeRoomSettingsHandler } from './handlers/changeRoomSettings';
import { deleteRoomHandler } from './handlers/deleteRoom';
import { joinRoomHandler } from './handlers/joinRoom';
import { leaveRoomHandler } from './handlers/leaveRoom';
import { markMessageReadHandler } from './handlers/markMessageRead';
import { markStoryReadHandler } from './handlers/marStoryRead';
import { sendMessageHandler } from './handlers/sendMessage';
import { submitActionHandler } from './handlers/submitAction';
import { submitStoryHandler } from './handlers/submitStory';
import { subscribeToRoomHandler } from './handlers/subscribeToRoom';

export class User {
    constructor(
        socket: QuasmSocket,
        io: QuasmSocketServer,
        dataAccess: DataAccessFacade,
        authProvider: IAuthProvider,
        fileStorageProvider: IFileStorage
    ) {
        socket.prependAny(event => {
            logger.info(QuasmComponent.SOCKET, [
                chalk.green(socket.data.userID),
                chalk.redBright('RECV'),
                event
            ] as string[]);
        });

        const handlers = [
            joinRoomHandler,
            subscribeToRoomHandler,
            sendMessageHandler,
            changeCharacterSettingsHandler,
            changeRoomSettingsHandler,
            submitActionHandler,
            leaveRoomHandler,
            submitStoryHandler,
            deleteRoomHandler,
            markStoryReadHandler,
            markMessageReadHandler
        ];

        handlers.forEach(handler => {
            handler({
                io,
                socket,
                dataAccess,
                authProvider,
                fileStorageProvider
            });
        });
    }
}
