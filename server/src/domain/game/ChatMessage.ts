import { randomUUID, UUID } from 'crypto';

export type Chatter = UUID | 'all';

export class ChatMessageDetails {
    constructor(
        public from: UUID,
        public to: Chatter,
        public content: string
    ) {}
}

export class ChatMessage {
    constructor(
        public id: number,
        public from: UUID,
        public to: Chatter,
        public content: string,
        public timestamp: Date
    ) {}
}
