import { UUID } from 'crypto';

import { Chat } from '@/domain/game/chat/Chat';

import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function joinRoomHandler({
    dataAccess,
    authProvider,
    socket,
    io
}: HandlerConfig) {
    socket.on('joinRoom', (roomID, respond) => {
        withErrorHandling(async () => {
            const room = await dataAccess.roomRepository.getRoomByID(
                roomID as UUID
            );

            const { nickname, profileImg } =
                await authProvider.fetchUserDetails(socket.data.token);

            const characterDetails = {
                userID: socket.data.userID,
                nick: nickname,
                profileIMG: profileImg
            };

            const character =
                await room.characters.addCharacter(characterDetails);

            respond({
                success: true
            });

            const roomSockets = await io.in(room.id).fetchSockets();

            roomSockets.forEach(otherSocket => {
                const other = room.characters.getCharacterByUserID(
                    otherSocket.data.userID
                );

                void otherSocket.join(
                    JSON.stringify(Chat.toId([other.id, character.id]))
                );
            });

            socket.to(room.id).emit('newPlayer', {
                id: character.id,
                nick: character.getNick(),
                profileIMG: characterDetails.profileIMG,
                isReady: !!character.getTurnSubmit()
            });
        }, respond);
    });
}
