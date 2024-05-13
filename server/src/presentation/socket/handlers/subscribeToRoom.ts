import { QuasmComponent } from '@quasm/common';
import { UUID } from 'crypto';

import { logger } from '@/infrastructure/logger/Logger';

import { isMemberOf } from '../utils';
import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function subscribeToRoomHandler({ socket, dataAccess }: HandlerConfig) {
    socket.on('subscribeToRoom', (id, respond) => {
        withErrorHandling(respond, async () => {
            const room = await dataAccess.roomRepository.getRoomByID(
                id as UUID
            );

            if (!isMemberOf(socket, room)) {
                respond({
                    success: false,
                    error: "You don't belong to this room"
                });

                return;
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
                `Socket ${socket.id} subscribed to ${room.id}`
            );
        });
    });
}
