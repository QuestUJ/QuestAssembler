import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { createClient } from '@supabase/supabase-js';
import { randomUUID, UUID } from 'crypto';

import { IFileStorage } from './IFileStorage';
/**
 * Supabase based file storage
 */
export class SupabaseStorageProvider implements IFileStorage {
    private readonly url;
    private readonly serviceKey;
    private readonly client;

    constructor(supabaseConnectionUrl: string, serviceKey: string) {
        this.url = supabaseConnectionUrl;
        this.serviceKey = serviceKey;
        this.client = createClient(supabaseConnectionUrl, serviceKey);
    }

    validateImage(image: Buffer): boolean {
        image;
        return true;
    }

    async uploadImage(image: Buffer, roomId: string): Promise<string> {
        //validate
        if (!this.validateImage(image)) {
            throw new QuasmError(
                QuasmComponent.STORAGE,
                400,
                ErrorCode.StorageValidationFailed,
                'Story chunk image validation failed'
            );
        }

        const { data, error } = await this.client.storage
            .from('story_images')
            .upload(`${roomId}/${randomUUID()}`, image); // currently insert at random created UUID, may later be correlated to the story chunk ID

        if (error) {
            throw new QuasmError(
                QuasmComponent.STORAGE,
                500,
                ErrorCode.StorageAPI,
                error.message
            );
        }

        return `${this.url}/${data?.path}`;
    }

    async uploadAvatar(
        image: Buffer,
        userId: UUID,
        roomId: UUID
    ): Promise<string> {
        // validate bla bla bla
        const { data, error } = await this.client.storage
            .from('avatars')
            .upload(`${userId}/${roomId}`, image, {
                upsert: true
            });
        if (error) {
            throw new QuasmError(
                QuasmComponent.STORAGE,
                500,
                ErrorCode.StorageAPI,
                error.message
            );
        }

        return `${this.url}/${data?.path}`;
    }
}
