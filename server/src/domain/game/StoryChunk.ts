export class StoryChunk {
    readonly id: number;
    readonly title: string;
    readonly content: string;
    readonly imageUrl: string;
    readonly timestamp: Date;

    constructor(title: string) {
        this.id = -1;
        this.title = title;
        this.content = '';
        this.imageUrl = '';
        this.timestamp = new Date();
    }
}
