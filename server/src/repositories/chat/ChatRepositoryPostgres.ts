import { UUID } from 'crypto';

import { ChatMessage } from '@/domain/game/ChatMessage';

import { IChatRepository } from './IChatRepository';

export class ChatRepositoryPostgres implements IChatRepository {
    createMessage(content: string): ChatMessage {
        content;
        return new ChatMessage();
    }
    fetchMessages(chatID: UUID): ChatMessage[] {
        chatID;
        return [];
    }
}
