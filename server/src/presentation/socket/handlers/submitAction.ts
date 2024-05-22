import { UUID } from 'crypto';

import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function submitActionHandler({ socket, dataAccess }: HandlerConfig) {
    socket.on('submitAction', ({ content, roomID }, res) => {
        withErrorHandling(res, async () => {
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
                    timestamp
                }
            });
        });
    });
}
