import { UUID, randomUUID } from 'crypto';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { ChatMessage, ChatMessageDetails, Chatter } from './ChatMessage';

const MAX_CHAT_MESSAGES: number = 500;
const MAX_CHAT_MESSAGE_LENGTH: number = 280;

export interface Range {
    offset: number | undefined, // numer id ostatniej wiadomości jaką mamy (zwróci nam te które są przed nią) albo undefined kiedy chcemy dostać po prostu `count` ostatnich wiadomości/chunków
    count: number // Ile kolejnych wiadomości/chunków chcemy
}

export class Chat {
    private messages: ChatMessage[] = [];

    constructor(
        readonly roomRepository: IRoomRepository) {
    }

    async addMessage(chatMessageDetails: ChatMessageDetails): Promise<void> {
        if (this.messages.length == MAX_CHAT_MESSAGES) {
            throw QuasmError();
            // throw error
        }

        if (chatMessageDetails.content.length > MAX_CHAT_MESSAGE_LENGTH) {
            throw QuasmError();
            // throw error
        }

        const newMessage = await this.roomRepository.addMessage(chatMessageDetails);
        this.messages.push(newMessage);
    }

    async fetchMessages(from: UUID, to: Chatter, range: Range): Promise<void> {
        const fetchedMessages = await this.roomRepository.fetchMessages(from, to, range); 
        this.messages.concat(fetchedMessages);
    }
}
