import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { UUID } from 'crypto';

import { Chat } from '@/domain/game/chat/Chat';

import { isMemberOf } from '../utils';
import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function subscribeToRoomHandler({ socket, dataAccess }: HandlerConfig) {
    socket.on('subscribeToRoom', (id, respond) => {
        withErrorHandling(async () => {
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

            // Unsubscribe old room
            if (socket.data.subscribedRoomID) {
                const oldRoom = await dataAccess.roomRepository.getRoomByID(
                    socket.data.subscribedRoomID as UUID
                );
                const oldCharacter = oldRoom.characters.getCharacterByUserID(
                    socket.data.userID
                );

                await socket.leave(oldRoom.id);

                await Promise.all(
                    oldRoom.chats
                        .getPrivateChatsOfCharacter(oldCharacter.id)
                        .map(async chat => {
                            await socket.leave(
                                JSON.stringify(
                                    Chat.toId(chat.chatters as [UUID, UUID])
                                )
                            );
                        })
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
                        await socket.join(
                            JSON.stringify(
                                Chat.toId(chat.chatters as [UUID, UUID])
                            )
                        );
                    })
            );

            socket.data.subscribedRoomID = room.id;

            respond({
                success: true
            });
        }, respond);
    });
}
