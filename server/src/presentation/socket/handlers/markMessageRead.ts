import { UUID } from 'crypto';

import { Chatter } from '@/domain/game/chat/ChatMessage';

import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function markMessageReadHandler({ socket, dataAccess }: HandlerConfig) {
    socket.on('markMessageRead', ({ roomID, senderID, messageID }) => {
        withErrorHandling(async () => {
            const room = await dataAccess.roomRepository.getRoomByID(
                roomID as UUID
            );

            const character = room.characters.getCharacterByUserID(
                socket.data.userID
            );

            await room.notifier.markMessageAsRead({
                characterID: character.id,
                senderID: senderID as Chatter,
                messageID
            });
        });
    });
}
