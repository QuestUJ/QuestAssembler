import { UUID } from 'crypto';

export type ChatParticipants = [UUID, UUID] | 'broadcast';

export type Chatter = UUID | 'broadcast';

export interface ChatMessageDetails {
    from: UUID;
    to: Chatter;
    content: string;
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
