import { ChunkRange } from '@quasm/common';
import { UUID } from 'crypto';

import {
    ChatMessage,
    ChatMessageDetails,
    ChatParticipants
} from '@/domain/game/chat/ChatMessage';

export interface IChatRepository {
    addMessage(chatMessageDetails: ChatMessageDetails): Promise<ChatMessage>;

    /**
     * Returns number of messages inside a given chat
     */
    fetchMessageCount(
        chatParticipants: ChatParticipants,
        roomID: UUID
    ): Promise<number>;

    fetchMessages(
        chatParticipants: ChatParticipants,
        range: ChunkRange
    ): Promise<ChatMessage[]>;
}
