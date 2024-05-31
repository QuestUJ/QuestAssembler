import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Chatter } from '@/domain/game/chat/ChatMessage';
import { Database } from '@/infrastructure/postgres/db';

import { INotifierRepository } from './INotifierRepository';

export class NotifierRepositoryPostgres implements INotifierRepository {
    constructor(private readonly db: Kysely<Database>) {}

    async markStoryAsRead({
        chunkID,
        characterID
    }: {
        chunkID: number;
        characterID: UUID;
    }): Promise<void> {
        const current = await this.db
            .selectFrom('StoryReadTracking')
            .where('receiver', '=', characterID)
            .selectAll()
            .executeTakeFirst();

        if (!current) {
            await this.db
                .insertInto('StoryReadTracking')
                .values({
                    receiver: characterID,
                    lastRead: chunkID
                })
                .executeTakeFirstOrThrow();

            return;
        }

        if (current.lastRead && chunkID <= current.lastRead) {
            return;
        }

        await this.db
            .updateTable('StoryReadTracking')
            .set({
                lastRead: chunkID
            })
            .where('receiver', '=', characterID)
            .executeTakeFirstOrThrow();
    }

    async markMessageAsRead({
        messageID,
        characterID,
        senderID
    }: {
        messageID: number;
        characterID: UUID;
        senderID: Chatter;
    }): Promise<void> {
        const current = await this.db
            .selectFrom('ChatReadTracking')
            .where('receiver', '=', characterID)
            .where('sender', '=', senderID)
            .selectAll()
            .executeTakeFirst();

        if (!current) {
            await this.db
                .insertInto('ChatReadTracking')
                .values({
                    receiver: characterID,
                    sender: senderID,
                    senderCharacter: senderID === 'broadcast' ? null : senderID,
                    lastRead: messageID
                })
                .executeTakeFirstOrThrow();
            return;
        }

        if (current.lastRead && messageID <= current.lastRead) {
            return;
        }

        await this.db
            .updateTable('ChatReadTracking')
            .set({
                lastRead: messageID
            })
            .where('receiver', '=', characterID)
            .where('sender', '=', senderID)
            .executeTakeFirstOrThrow();
    }

    async countUnreadMessages(
        characterID: UUID,
        roomID: UUID
    ): Promise<Record<string, number>> {
        const charactersQuery = this.db
            .selectFrom('Characters')
            .where('roomID', '=', roomID)
            .where('id', '!=', characterID)
            .leftJoin('ChatReadTracking', join =>
                join
                    .on('ChatReadTracking.receiver', '=', characterID)
                    .onRef(
                        'Characters.id',
                        '=',
                        'ChatReadTracking.senderCharacter'
                    )
            )
            .leftJoin('ChatMessages', join =>
                join
                    .onRef('Characters.id', '=', 'ChatMessages.from')
                    .on('ChatMessages.to', '=', characterID)
                    .on(eb =>
                        eb.or([
                            eb('lastRead', 'is', null),
                            eb(
                                'ChatMessages.messageID',
                                '>',
                                eb.ref('lastRead')
                            )
                        ])
                    )
            )
            .groupBy('Characters.id')
            .select(eb => [
                'Characters.id',
                eb.fn.count('ChatMessages.messageID').as('numOfMessages')
            ]);

        const broadcastQuery = this.db
            .selectFrom('Characters')
            .where('roomID', '=', roomID)
            .where('id', '!=', characterID)
            .leftJoin('ChatReadTracking', join =>
                join
                    .on('ChatReadTracking.receiver', '=', characterID)
                    .on('ChatReadTracking.sender', '=', 'broadcast')
            )
            .leftJoin('ChatMessages', join =>
                join
                    .on('ChatMessages.to', 'is', null)
                    .onRef('ChatMessages.from', '=', 'Characters.id')
                    .on(eb =>
                        eb.or([
                            eb('lastRead', 'is', null),
                            eb(
                                'ChatMessages.messageID',
                                '>',
                                eb.ref('lastRead')
                            )
                        ])
                    )
            )
            .groupBy('ChatReadTracking.sender')
            .select(eb => [
                eb.val('broadcast').as('id'),
                eb.fn.count('ChatMessages.messageID').as('numOfMessages')
            ]);

        const result = await charactersQuery.union(broadcastQuery).execute();

        return result.reduce(
            (acc, row) => ({ ...acc, [row.id]: row.numOfMessages }),
            {}
        );
    }

    async countUnreadStoryChunks(
        characterID: UUID,
        roomID: `${string}-${string}-${string}-${string}-${string}`
    ): Promise<number> {
        const result = await this.db
            .with('lastRead', db =>
                db
                    .selectFrom('StoryReadTracking')
                    .where('receiver', '=', characterID)
                    .select('lastRead as id')
            )
            .selectFrom('StoryChunks')
            .leftJoin('lastRead', join => join.onTrue())
            .where('StoryChunks.roomID', '=', roomID)
            .where(eb =>
                eb.or([
                    eb('lastRead.id', 'is', null),
                    eb('StoryChunks.chunkID', '>', eb.ref('lastRead.id'))
                ])
            )
            .select(eb => [
                eb.fn.count('StoryChunks.chunkID').as('numOfChunks')
            ])
            .executeTakeFirstOrThrow();

        return result.numOfChunks as number;
    }
}
