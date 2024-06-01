import { UUID } from 'crypto';

import { Chat } from '@/domain/game/chat/Chat';

import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function leaveRoomHandler({
    dataAccess,
    authProvider,
    socket,
    io,
    fileStorageProvider
}: HandlerConfig) {
    socket.on('leaveRoom', (roomID, respond) => {
        withErrorHandling(async () => {
            authProvider;

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

            await socket.leave(room.id);

            socket.to(room.id).emit('playerLeft', {
                id: character.id,
                nick: character.getNick(),
                profileIMG: character.getProfileImageURL(),
                isReady: !!character.getTurnSubmit()
            });

            if (character.getProfileImageURL()) {
                await fileStorageProvider.deleteImageAtPublicURL(
                    character.getProfileImageURL()!
                );
            }
            await room.characters.deleteCharacter(character.id);

            respond({
                success: true
            });
        }, respond);
    });
}
