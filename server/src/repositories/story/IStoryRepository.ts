import { ChunkRange } from '@quasm/common';
import { UUID } from 'crypto';

import { StoryChunk, StoryChunkDetails } from '@/domain/game/story/StoryChunk';

export interface IStoryRepository {
    /**
     * Adds StoryChunk to the specified Room
     */
    addStoryChunk(
        roomID: UUID,
        storyChunk: StoryChunkDetails
    ): Promise<StoryChunk>;
    /**
     * Returns the requested part of the story - the StoryChunks specified in ChunkRange
     */
    fetchStory(roomID: UUID, range: ChunkRange): Promise<StoryChunk[]>;

    fetchAllStoryChunks(roomID: UUID): Promise<StoryChunk[]>;
}
