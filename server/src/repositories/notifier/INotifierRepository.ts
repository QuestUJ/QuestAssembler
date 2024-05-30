import { UUID } from 'crypto';

import { Chatter } from '@/domain/game/chat/ChatMessage';

export interface INotifierRepository {
    markStoryAsRead(options: {
        chunkID: number;
        characterID: UUID;
    }): Promise<void>;

    markMessageAsRead(options: {
        messageID: number;
        characterID: UUID;
        senderID: Chatter;
    }): Promise<void>;

    countUnreadMessages(
        characterID: UUID,
        roomID: UUID
    ): Promise<Record<string, number>>;

    countUnreadStoryChunks(characterID: UUID, roomID: UUID): Promise<number>;
}
