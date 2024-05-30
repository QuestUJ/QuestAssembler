import { UUID } from 'crypto';

import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function markStoryReadHandler({ socket, dataAccess }: HandlerConfig) {
    socket.on('markStoryRead', ({ roomID, chunkID }) => {
        withErrorHandling(async () => {
            const room = await dataAccess.roomRepository.getRoomByID(
                roomID as UUID
            );

            const character = room.characters.getCharacterByUserID(
                socket.data.userID
            );

            await room.notifier.markStoryAsRead({
                characterID: character.id,
                chunkID
            });
        });
    });
}
