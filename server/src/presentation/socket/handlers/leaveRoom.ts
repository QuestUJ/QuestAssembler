import { QuasmComponent } from '@quasm/common';
import { UUID } from 'crypto';

import { Chat } from '@/domain/game/chat/Chat';
import { logger } from '@/infrastructure/logger/Logger';

import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function leaveRoomHandler({
    dataAccess,
    authProvider,
    socket,
    io
}: HandlerConfig) {
    socket.on('leaveRoom', (roomID, respond) => {
        withErrorHandling(respond, async () => {
            authProvider;

            logger.info(
                QuasmComponent.SOCKET,
                `${socket.data.userID} | SOCKET leaveRoom RECEIVED ${roomID} `
            );

            const room = await dataAccess.roomRepository.getRoomByID(
                roomID as UUID
            );

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

            socket.to(room.id).emit('playerLeft', {
                id: character.id,
                nick: character.getNick(),
                profileIMG: character.profileIMG,
                isReady: !!character.getTurnSubmit()
            });

            await room.characters.deleteCharacter(character.id);

            respond({
                success: true
            });

            logger.info(
                QuasmComponent.SOCKET,
                `${socket.data.userID} | SOCKET leaveRoom SUCCESS ${roomID} `
            );
        });
    });
}
