import { UUID } from 'crypto';

import { Chatter } from '@/domain/game/chat/ChatMessage';

export interface INotifierRepository {
    /**
     * Stores ID of last fetched Story chunk
     */
    markStoryAsRead(options: {
        chunkID: number;
        characterID: UUID;
    }): Promise<void>;

    /**
     * Stores ID of last fetched message in chat
     */
    markMessageAsRead(options: {
        messageID: number;
        characterID: UUID;
        senderID: Chatter;
    }): Promise<void>;

    /**
     * Returns a record with numbers of unread messages from each character and broadcast
     */
    countUnreadMessages(
        characterID: UUID,
        roomID: UUID
    ): Promise<Record<string, number>>;

    /**
     * Returns a number of unread story chunks
     */
    countUnreadStoryChunks(characterID: UUID, roomID: UUID): Promise<number>;
}
