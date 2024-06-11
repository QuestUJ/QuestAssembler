// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { randomUUID } from 'crypto';
import { describe, expect, it } from 'vitest';

import { ChatMessage } from './ChatMessage';

describe('ChatMessage contruction', () => {
    const author = randomUUID();
    const content = 'Test content!';
    const timestamp = new Date();

    const msg = new ChatMessage(author, content, timestamp);

    it('Persists message content', () => {
        expect(msg.author).toEqual(author);
        expect(msg.content).toEqual(content);
        expect(msg.timestamp).toEqual(timestamp);
    });
});
