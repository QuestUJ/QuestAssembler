import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

import { config } from '@/config';

import { SupabaseStorageProvider } from './SupabaseStorageProvider';

// path: server/test-assets/ex.jpeg
const sampleImage = readFileSync(
    join(__dirname, '..', '..', '..', '..', 'test-assets', 'ex.jpeg')
);

const { SUPABASE_SERVICE_KEY, SUPABASE_CONNECTION_URL } = config.pick([
    'SUPABASE_SERVICE_KEY',
    'SUPABASE_CONNECTION_URL'
]);

describe('SupabaseStorageProvider', () => {
    const supa = new SupabaseStorageProvider(
        SUPABASE_CONNECTION_URL,
        SUPABASE_SERVICE_KEY
    );

    it(
        'should be able to store simple image',
        async () => {
            const url = await supa.uploadImage(sampleImage, 'test');

            const response = await fetch(url);
            const blob = await response.blob();

            expect(await blob.arrayBuffer()).toEqual(sampleImage.buffer);

            await supa.deleteImageAtPublicURL(url);
        },
        { timeout: 20000 }
    );
});
