import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { createClient } from '@supabase/supabase-js';
import { randomUUID, UUID } from 'crypto';

import { IFileStorage } from './IFileStorage';
import { logger } from '@/infrastructure/logger/Logger';
import { Readable } from 'stream';
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

    validateImage(image: Blob): boolean {
        image;
        return true;
    }

    async uploadImage(image: Blob, roomId: string): Promise<string> {
        //validate
        if (!this.validateImage(image)) {
            throw new QuasmError(
                QuasmComponent.STORAGE,
                400,
                ErrorCode.StorageValidationFailed,
                'Story chunk image validation failed'
            );
        }
        const file = new File([image], "image");

        const response = await fetch(`${this.url}/object/story_images/${roomId}/${randomUUID()}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.serviceKey}`
            },
            body: file
        })
        const data = await response.json();
        //validate if error
        return `${this.url}/object/public/${data?.Key}`;
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

        return `${this.url}/object/${data?.path}`;
    }
}
