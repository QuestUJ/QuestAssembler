import { UUID } from 'crypto';

import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function submitActionHandler({ socket, dataAccess, io }: HandlerConfig) {
    socket.on('submitAction', ({ content, roomID }, res) => {
        withErrorHandling(async () => {
            const room = await dataAccess.roomRepository.getRoomByID(
                roomID as UUID
            );

            const character = room.characters.getCharacterByUserID(
                socket.data.userID
            );

            const { content: savedContent, timestamp } =
                await character.setTurnSubmit(content);

            res({
                success: true,
                payload: {
                    content: savedContent,
                    timestamp: timestamp.toISOString()
                }
            });

            const masterID = room.characters.getGameMaster().userID;

            const roomSockets = await io.in(roomID).fetchSockets();

            socket.to(roomID).emit('playerReady', character.id);

            const masterSocket = roomSockets.find(
                socket => socket.data.userID === masterID
            );

            if (masterSocket) {
                masterSocket.emit('turnSubmit', {
                    characterID: character.id,
                    nick: character.getNick(),
                    profileIMG: character.getProfileImageURL(),
                    content: savedContent,
                    timestamp: timestamp.toISOString()
                });
            }
        }, res);
    });
}
