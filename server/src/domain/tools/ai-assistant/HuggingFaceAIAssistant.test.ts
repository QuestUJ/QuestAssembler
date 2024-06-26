import { describe, expect, it } from 'vitest';

import { config } from '@/config';

import { HuggingFaceAiAssistant } from './HuggingFaceAIAssistant';

const { HUGGINGFACE_TOKEN } = config.pick(['HUGGINGFACE_TOKEN']);

/**
 * Check if png header is present
 */
function isPNG(buffer: Buffer) {
    return buffer[0] === 0x89 && buffer.toString('utf-8', 1, 4) == 'PNG';
}

/**
 * Check if jpeg header is present
 */
function isJPEG(buffer: Buffer) {
    return buffer[0] === 0xff && buffer[1] === 0xd8;
}

describe('HuggingFaceAIAssistant', () => {
    const hug = new HuggingFaceAiAssistant(HUGGINGFACE_TOKEN);

    it(
        'should generate text',
        async () => {
            const response = await hug.getText('Write me a story about a dog!');

            expect(response).toMatch(/.*dog.*/);
        },
        { timeout: 20000 }
    );

    it('should generate image', async () => {
        const img = await hug.getImage('Fantasy epic castle');

        expect(img).toBeInstanceOf(Buffer);

        expect(isJPEG(img) || isPNG(img)).toBeTruthy();
    });
});
