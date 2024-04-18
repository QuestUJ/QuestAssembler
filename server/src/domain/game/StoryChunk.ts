export class StoryChunk {
    readonly id: number = -1;
    readonly title: string = '';
    readonly content: string = '';
    readonly imageUrl: string = '';
    readonly timestamp: Date = new Date();

    constructor(
        id: number,
        title: string,
        content: string,
        imageUrl: string,
        timestamp: Date
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.timestamp = timestamp;
    }
}
