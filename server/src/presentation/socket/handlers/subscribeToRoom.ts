import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { UUID } from 'crypto';

import { logger } from '@/infrastructure/logger/Logger';

import { isMemberOf } from '../utils';
import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function subscribeToRoomHandler({ socket, dataAccess }: HandlerConfig) {
    socket.on('subscribeToRoom', (id, respond) => {
        withErrorHandling(respond, async () => {
            logger.info(
                QuasmComponent.SOCKET,
                `${socket.data.userID} | SOCKET subscribeToRoom RECEIVED ${id}`
            );

            const room = await dataAccess.roomRepository.getRoomByID(
                id as UUID
            );

            if (!isMemberOf(socket, room)) {
                throw new QuasmError(
                    QuasmComponent.SOCKET,
                    400,
                    ErrorCode.RoomNotFound,
                    `${socket.data.userID} is not member of ${id}`
                );
            }

            const character = room.characters.getCharacterByUserID(
                socket.data.userID
            );

            // Subsribe to room events
            await socket.join(room.id);
            await Promise.all(
                room.chats
                    .getPrivateChatsOfCharacter(character.id)
                    .map(async chat => {
                        await socket.join(JSON.stringify(chat.chatters));
                    })
            );
            logger.info(
                QuasmComponent.SOCKET,
                `${socket.data.userID} | SOCKET subscribeToRoom SUCCESS ${id}`
            );
        });
    });
}
