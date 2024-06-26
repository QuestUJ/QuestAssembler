import { ChunkRange } from '@quasm/common';
import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import { StoryChunk, StoryChunkDetails } from '@/domain/game/story/StoryChunk';
import { Database } from '@/infrastructure/postgres/db';

import { IStoryRepository } from './IStoryRepository';

export class StoryRepositoryPostgres implements IStoryRepository {
    constructor(private db: Kysely<Database>) {}

    async addStoryChunk(
        roomID: UUID,
        chunk: StoryChunkDetails
    ): Promise<StoryChunk> {
        const saved = await this.db
            .insertInto('StoryChunks')
            .values({
                roomID,
                imageURL: chunk.imageURL,
                ...chunk
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        return new StoryChunk(
            saved.chunkID,
            saved.title,
            saved.content,
            saved.imageURL ?? undefined,
            saved.timestamp
        );
    }

    async fetchStory(roomID: UUID, range: ChunkRange): Promise<StoryChunk[]> {
        let baseQuery = this.db
            .selectFrom('StoryChunks')
            .where('roomID', '=', roomID)
            .orderBy('chunkID desc');

        if (range.offset) {
            baseQuery = baseQuery.where('chunkID', '<', range.offset);
        }

        const storyChunkData = await baseQuery
            .limit(range.count)
            .selectAll()
            .execute();

        return storyChunkData
            .reverse()
            .map(
                ch =>
                    new StoryChunk(
                        ch.chunkID,
                        ch.title,
                        ch.content,
                        ch.imageURL ? ch.imageURL : ''
                    )
            );
    }

    async fetchAllStoryChunks(roomID: UUID) {
        const storyChunkData = await this.db
            .selectFrom('StoryChunks')
            .where('StoryChunks.roomID', '=', roomID)
            .selectAll()
            .execute();

        return storyChunkData.map(
            ch =>
                new StoryChunk(
                    ch.chunkID,
                    ch.title,
                    ch.content,
                    ch.imageURL ? ch.imageURL : ''
                )
        );
    }
}
