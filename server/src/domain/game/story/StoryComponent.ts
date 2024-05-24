import {
    ChunkRange,
    ErrorCode,
    MAX_STORY_CHUNK_LENGTH,
    QuasmComponent,
    QuasmError
} from '@quasm/common';
import { UUID } from 'crypto';

import { AsyncEventEmitter } from '@/domain/core/AsyncEventEmitter';
import { IQuasmEventEmitter } from '@/domain/core/IQuasmEventEmitter';
import { IStoryRepository } from '@/repositories/story/IStoryRepository';

import { StoryChunk, StoryChunkDetails } from './StoryChunk';

interface StoryEventMap {
    newStoryChunk: (chunk: StoryChunk) => Promise<void>;
}

export class StoryComponent implements IQuasmEventEmitter<StoryEventMap> {
    private emitter: AsyncEventEmitter<StoryEventMap>;

    constructor(
        private storyRepository: IStoryRepository,
        private roomID: UUID
    ) {
        this.emitter = new AsyncEventEmitter();
    }

    on<T extends keyof StoryEventMap>(
        event: T,
        handler: (payload: StoryEventMap[T]) => void | Promise<void>
    ): void {
        // @ts-expect-error Argument
        this.emitter.on(event, handler);
    }

    fetchStory(range: ChunkRange): Promise<StoryChunk[]> {
        return this.storyRepository.fetchStory(this.roomID, range);
    }

    async addStoryChunk(chunk: StoryChunkDetails): Promise<StoryChunk> {
        if (chunk.content.length > MAX_STORY_CHUNK_LENGTH) {
            throw new QuasmError(
                QuasmComponent.STORY,
                400,
                ErrorCode.ChunkLengthExceeded,
                'Story Chunk length exceeded'
            );
        }

        const saved = await this.storyRepository.addStoryChunk(
            this.roomID,
            chunk
        );

        await this.emitter.emit('newStoryChunk', saved);

        return saved;
    }
}
