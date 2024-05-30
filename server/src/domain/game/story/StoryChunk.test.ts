import { describe, expect, it } from 'vitest';

import { StoryChunk } from './StoryChunk';

describe('StoryChunk construction', () => {
    const id = 0;
    const title = 'Test title!';
    const content = 'Test content!';
    const imageUrl = 'Test image url!';
    const timestamp = new Date();

    const storyChunk = new StoryChunk(id, title, content, imageUrl, timestamp);

    it('Persists message content', () => {
        expect(storyChunk.id).toEqual(id);
        expect(storyChunk.title).toEqual(title);
        expect(storyChunk.content).toEqual(content);
        expect(storyChunk.imageURL).toEqual(imageUrl);
        expect(storyChunk.timestamp).toEqual(timestamp);
    });
});
