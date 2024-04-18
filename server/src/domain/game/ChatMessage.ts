import { randomUUID, UUID } from 'crypto';

export class ChatMessage {
    readonly author: UUID = randomUUID();
    readonly content: string = '';
    readonly timestamp: Date = new Date();

    constructor(author: UUID, content: string, timestamp: Date) {
        this.author = author;
        this.content = content;
        this.timestamp = timestamp;
    }
}
