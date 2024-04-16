import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

import { SupabaseStorageProvider } from './SupabaseStorageProvider';

const sampleImage = readFileSync(
    join(__dirname, '..', '..', '..', '..', 'test-assets', 'ex.jpeg')
);

describe('SupabaseStorageProvider', () => {
    const supa = new SupabaseStorageProvider();

    it('Should be able to store simple image', async () => {
        const url = await supa.uploadImage(sampleImage);

        const response = await fetch(url);
        const blob = await response.blob();

        expect(await blob.arrayBuffer()).toEqual(sampleImage.buffer);
    });
});
