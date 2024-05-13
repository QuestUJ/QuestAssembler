import {
    ChunkRange,
    ErrorCode,
    MAX_STORY_CHUNK_LENGTH,
    QuasmComponent,
    QuasmError
} from '@quasm/common';
import { UUID } from 'crypto';

import { IStoryRepository } from '@/repositories/story/IStoryRepository';

import { StoryChunk, StoryChunkDetails } from './StoryChunk';

export class StoryComponent {
    constructor(
        private storyRepository: IStoryRepository,
        private roomID: UUID
    ) {}

    fetchStory(range: ChunkRange): Promise<StoryChunk[]> {
        return this.storyRepository.fetchStory(this.roomID, range);
    }

    addStoryChunk(chunk: StoryChunkDetails): Promise<StoryChunk> {
        if (chunk.content.length > MAX_STORY_CHUNK_LENGTH) {
            throw new QuasmError(
                QuasmComponent.STORY,
                400,
                ErrorCode.ChunkLengthExceeded,
                'Story Chunk length exceeded'
            );
        }
        return this.storyRepository.addStoryChunk(this.roomID, chunk);
    }
}
