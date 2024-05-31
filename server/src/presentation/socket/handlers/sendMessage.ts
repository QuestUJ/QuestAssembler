import { MsgEvent, QuasmComponent } from '@quasm/common';
import { UUID } from 'crypto';

import { Chat } from '@/domain/game/chat/Chat';
import { logger } from '@/infrastructure/logger/Logger';

import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function sendMessageHandler({ socket, dataAccess }: HandlerConfig) {
    socket.on('sendMessage', ({ roomID, receiver, content }, respond) => {
        withErrorHandling(async () => {
            logger.info(
                QuasmComponent.SOCKET,
                `${socket.data.userID} | SOCKET sendMessage RECEIVED receiver: ${receiver}`
            );

            const room = await dataAccess.roomRepository.getRoomByID(
                roomID as UUID
            );
            const myCharacter = room.characters.getCharacterByUserID(
                socket.data.userID
            );

            const msg = await room.chats
                .getChat(
                    receiver === 'broadcast'
                        ? 'broadcast'
                        : [myCharacter.id, receiver as UUID]
                )
                .addMessage({
                    content,
                    to: receiver as UUID,
                    from: myCharacter.id
                });

            const payload: MsgEvent = {
                id: msg.id,
                broadcast: receiver === 'broadcast',
                roomID: room.id,
                from: msg.from,
                authorName: myCharacter.getNick(),
                content: content,
                timestamp: msg.timestamp.toISOString(),
                characterPictureURL: myCharacter.getProfileImageURL()
            };

            respond({
                success: true,
                payload
            });

            if (msg.to === 'broadcast') {
                socket.to(room.id).emit('message', payload);
            } else {
                socket
                    .to(JSON.stringify(Chat.toId([msg.from, msg.to])))
                    .emit('message', payload);
            }

            logger.info(
                QuasmComponent.SOCKET,
                `${socket.data.userID} | SOCKET sendMessage SUCCESS receiver: ${receiver}`
            );
        }, respond);
    });
}
