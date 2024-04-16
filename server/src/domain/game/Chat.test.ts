import { randomUUID } from 'crypto';
import { describe, expect, it, vi } from 'vitest';

import { IChatRepository } from '@/repositories/chat/IChatRepository';

import { Chat } from './Chat';
import { ChatMessage } from './ChatMessage';

describe('Basic chat actions', () => {
    const fakeRepo: IChatRepository = {
        createMessage: vi.fn().mockReturnValue({
            author: randomUUID(),
            content: 'Test message!',
            timestamp: new Date()
        }),
        fetchMessages: vi.fn().mockReturnValue([
            {
                author: randomUUID(),
                content: 'Hi!',
                timestamp: new Date()
            },
            {
                author: randomUUID(),
                content: 'Hello!',
                timestamp: new Date()
            },
            {
                author: randomUUID(),
                content: 'World!',
                timestamp: new Date()
            }
        ])
    };

    const testMessages: ChatMessage[] = [
        new ChatMessage(randomUUID(), 'Hi!', new Date()),
        new ChatMessage(randomUUID(), 'Hello!', new Date()),
        new ChatMessage(randomUUID(), 'World!', new Date())
    ];

    const chat = new Chat(fakeRepo);

    chat.addMessage(testMessages[0]);
    chat.addMessage(testMessages[1]);
    chat.addMessage(testMessages[2]);

    it('Appends a message to its history', () => {
        expect(chat.messages).toStrictEqual(testMessages);
    });

    it('Fetches all history', () => {
        expect(chat.fetchMessages({ start: 0, end: 2 })).toStrictEqual(
            testMessages
        );
    });

    it('Returns undefined when invalid range is passed', () => {
        expect(chat.fetchMessages({ start: 1, end: 0 })).toStrictEqual([]);
    });

    it('Returns exactly one message when range with the same starting and ending index is passed', () => {
        expect(chat.fetchMessages({ start: 1, end: 1 })).toStrictEqual(
            testMessages.slice(1, 2)
        );
    });

    it('Returns undefined when overflowing range is passed', () => {
        expect(chat.fetchMessages({ start: 3, end: 6 })).toStrictEqual([]);
        expect(chat.fetchMessages({ start: -2, end: 0 })).toStrictEqual([]);
    });

    it('Returns a valid slice when partially overflowing range is passed', () => {
        expect(chat.fetchMessages({ start: -2, end: 1 })).toStrictEqual(
            testMessages.slice(0, 2)
        );

        expect(chat.fetchMessages({ start: 1, end: 5 })).toStrictEqual(
            testMessages.slice(1, 3)
        );
    });
});
