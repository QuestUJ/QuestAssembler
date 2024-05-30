import { ChunkRange } from '@quasm/common';
import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import {
    ChatMessage,
    ChatMessageDetails,
    ChatParticipants
} from '@/domain/game/chat/ChatMessage';
import { Database } from '@/infrastructure/postgres/db';

import { IChatRepository } from './IChatRepository';

export class ChatRepositoryPostgres implements IChatRepository {
    constructor(private db: Kysely<Database>) {}

    async addMessage(
        chatMessageDetails: ChatMessageDetails
    ): Promise<ChatMessage> {
        const result = await this.db
            .insertInto('ChatMessages')
            .values({
                ...chatMessageDetails,
                to:
                    chatMessageDetails.to === 'broadcast'
                        ? null
                        : chatMessageDetails.to
            })
            .returning(['messageID', 'timestamp'])
            .executeTakeFirstOrThrow();

        const newChatMessage = new ChatMessage(
            result.messageID,
            chatMessageDetails.from,
            chatMessageDetails.to,
            chatMessageDetails.content,
            result.timestamp
        );

        return newChatMessage;
    }

    async fetchMessageCount(
        chatParticipants: ChatParticipants
    ): Promise<number> {
        if (chatParticipants === 'broadcast') {
            const { messageCount } = await this.db
                .selectFrom('ChatMessages')
                .where('ChatMessages.to', 'is', null)
                .select(({ fn }) =>
                    fn
                        .count<number>('ChatMessages.messageID')
                        .as('messageCount')
                )
                .executeTakeFirstOrThrow();

            return messageCount;
        }

        const [x, y] = chatParticipants;

        const { messageCount } = await this.db
            .selectFrom('ChatMessages')
            .where(eb =>
                eb.or([
                    eb('from', '=', x).and('to', '=', y),

                    eb('from', '=', y).and('to', '=', x)
                ])
            )
            .select(eb =>
                eb.fn.count<number>('ChatMessages.messageID').as('messageCount')
            )

            .executeTakeFirstOrThrow();

        return messageCount;
    }

    async fetchMessages(
        chatParticipants: ChatParticipants,
        range: ChunkRange
    ): Promise<ChatMessage[]> {
        let query = this.db.selectFrom('ChatMessages');
        if (chatParticipants === 'broadcast') {
            query = query.where('ChatMessages.to', 'is', null);
        } else {
            const [x, y] = chatParticipants;

            query = query.where(eb =>
                eb.or([
                    eb('from', '=', x).and('to', '=', y),

                    eb('from', '=', y).and('to', '=', x)
                ])
            );
        }

        if (range.offset) {
            query = query.where('ChatMessages.messageID', '<', range.offset);
        }

        return (
            await query
                .orderBy('messageID', 'desc')
                .limit(range.count)
                .selectAll()
                .execute()
        )
            .map(
                m =>
                    new ChatMessage(
                        m.messageID,
                        m.from as UUID,
                        m.to === null ? 'broadcast' : (m.to as UUID),
                        m.content,
                        m.timestamp
                    )
            )
            .toReversed();
    }
}
