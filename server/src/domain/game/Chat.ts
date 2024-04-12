import { ChatMessage } from './ChatMessage';

export class Chat {
    messages: ChatMessage[] = [];

    fetchMessages(count: number, offset: number = 0): ChatMessage[] {
        count;
        offset;
        return this.messages;
    }
}
