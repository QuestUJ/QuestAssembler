import { IChatRepository } from '@/repositories/chat/IChatRepository';

import { ChatMessage } from './ChatMessage';

type Range = { start: number; end: number };

export class Chat {
    messages: ChatMessage[] = [];

    constructor(chatRepository: IChatRepository) {
        chatRepository;
    }

    /**
     * Appends a message to the chat history
     */
    addMessage(message: ChatMessage): void {
        message;
    }

    /**
     *
     * @param {Range} range A range of messages to fetch counting from the newest
     */
    fetchMessages(range: Range): ChatMessage[] {
        range.start;
        range.end;
        return this.messages;
    }
}
