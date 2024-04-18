import { UUID } from 'crypto';

import { ChatMessage } from '@/domain/game/ChatMessage';

export interface IChatRepository {
    /**
     * Instantiates {@link Char} stores it's details in relavant storage and returns created object'
     */
    createMessage(content: string): Promise<ChatMessage>;
    /**
     * Retrieves all messages of the chat with given id
     */
    fetchMessages(chatID: UUID): Promise<ChatMessage[]>;
}
