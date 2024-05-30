import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { UUID } from 'crypto';

import { Chat } from '@/domain/game/chat/Chat';
import { logger } from '@/infrastructure/logger/Logger';

import { isMemberOf } from '../utils';
import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function subscribeToRoomHandler({
    socket,
    dataAccess,
    io
}: HandlerConfig) {
    socket.on('subscribeToRoom', (id, respond) => {
        withErrorHandling(async () => {
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

            const roomSockets = await io.in(room.id).fetchSockets();

            roomSockets.forEach(socket => {
                const other = room.characters.getCharacterByUserID(
                    socket.data.userID
                );

                socket.leave(
                    JSON.stringify(Chat.toId([other.id, character.id]))
                );
            });

            await socket.leave(room.id);

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
        }, respond);
    });
}
