import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import { ChatMessage } from '@/domain/game/ChatMessage';
import { Database } from '@/infrastructure/postgres/db';

import { IChatRepository } from './IChatRepository';

export class ChatRepositoryPostgres implements IChatRepository {
    constructor(db: Kysely<Database>) {
        db;
        Kysely;
    }

    async createMessage(content: string): Promise<ChatMessage> {
        await new Promise(() => content);
        return new ChatMessage();
    }

    fetchMessages(chatID: UUID): Promise<ChatMessage[]> {
        chatID;
        return new Promise(resolve => resolve([]));
    }
}
