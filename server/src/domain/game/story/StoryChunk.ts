export interface StoryChunkDetails {
    title: string;
    content: string;
    imageURL?: string;
}

export class StoryChunk {
    constructor(
        readonly id: number = -1,
        readonly title: string = '',
        readonly content: string = '',
        readonly imageURL: string = '',
        readonly timestamp: Date = new Date()
    ) {}
}
