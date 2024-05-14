import { randomUUID } from 'crypto';
import { describe, expect, it, vi } from 'vitest';

import { IChatRepository } from '@/repositories/chat/IChatRepository';

import { Chat } from './Chat';
import { ChatMessage } from './ChatMessage';

describe('Basic chat actions', async () => {
    const fakeRepo: IChatRepository = {
        addMessage: vi.fn().mockReturnValue({
            author: randomUUID(),
            content: 'Test message!',
            timestamp: new Date()
        }),
        fetchMessageCount: vi.fn().mockReturnValue(3),
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

    const p1 = randomUUID();
    const p2 = randomUUID();

    const chat = new Chat(fakeRepo, [p1, p2], randomUUID());

    await chat.addMessage({
        from: p1,
        to: p2,
        content: 'Hi!'
    });
    await chat.addMessage({
        from: p2,
        to: p1,
        content: 'Hi!'
    });
    await chat.addMessage({
        from: p1,
        to: p2,
        content: 'Hi!'
    });

    it('Appends a message to its history', async () => {
        expect((await chat.fetchMessages({ count: 3 })).length).toEqual(3);
    });

    it('Returns empty when overflowing range is passed', async () => {
        expect(
            await chat.fetchMessages({ count: 10, offset: 4 })
        ).toStrictEqual([]);
    });

    it('Returns a valid slice when partially overflowing range is passed', async () => {
        expect(
            (await chat.fetchMessages({ count: 4, offset: 1 })).length
        ).toEqual(1);
    });
});
