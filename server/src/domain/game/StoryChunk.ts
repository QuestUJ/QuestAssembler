export class StoryChunk {
    constructor(
        readonly id: number = -1,
        readonly title: string = '',
        readonly content: string = '',
        readonly imageUrl: string = '',
        readonly timestamp: Date = new Date()
    ) {}
}
