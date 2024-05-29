import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { randomUUID } from 'crypto';

import { IFileStorage } from './IFileStorage';

type CreateObjectSupabaseResponse = {
    Id: string;
    Key: string;
    error?: string;
};

/**
 * Supabase based file storage
 */
export class SupabaseStorageProvider implements IFileStorage {
    private readonly url;
    private readonly serviceKey;

    constructor(supabaseConnectionUrl: string, serviceKey: string) {
        this.url = supabaseConnectionUrl;
        this.serviceKey = serviceKey;
    }

    static validateImage(image: Blob): boolean {
        image;
        return true;
    }

    // wrapper method for easy access to supabase and uploading images
    async uploadImage(image: Blob, roomId: string): Promise<string> {
        //validate
        if (!SupabaseStorageProvider.validateImage(image)) {
            throw new QuasmError(
                QuasmComponent.STORAGE,
                400,
                ErrorCode.StorageValidationFailed,
                'Story chunk image validation failed'
            );
        }

        const objectURL = await this.requestObjectCreation(
            'story_images',
            roomId,
            image
        );

        return objectURL;
    }

    async uploadAvatar(
        image: Blob,
        roomId: string,
        oldAvatarURL?: string
    ): Promise<string> {
        if (!SupabaseStorageProvider.validateImage(image)) {
            throw new QuasmError(
                QuasmComponent.STORAGE,
                400,
                ErrorCode.StorageValidationFailed,
                'Story chunk image validation failed'
            );
        }

        if (oldAvatarURL) {
            await this.deleteImageAtPublicURL(oldAvatarURL);
        }
        const avatarURL = await this.requestObjectCreation(
            'avatars',
            roomId,
            image
        );
        return avatarURL;
    }

    // helper method, returns object URL if succeded in creating an item and throws error if it failed
    // in current version it is made for public resources
    async requestObjectCreation(bucket: string, roomId: string, image: Blob) {
        const file = new File([image], 'image');

        const supabaseResponse = await fetch(
            `${this.url}/object/${bucket}/${roomId}/${randomUUID()}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.serviceKey}`
                },
                body: file
            }
        );

        //validate if error
        if (supabaseResponse.status !== 200) {
            throw new QuasmError(
                QuasmComponent.STORAGE,
                400,
                ErrorCode.StorageAPI,
                supabaseResponse.statusText
            );
        }

        const data =
            (await supabaseResponse.json()) as CreateObjectSupabaseResponse;

        return `${this.url}/object/public/${data?.Key}`;
    }

    async deleteImageAtPublicURL(url: string) {
        const requestURL = url.replace('public/', '');
        const response = await fetch(requestURL, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${this.serviceKey}`
            }
        });

        if (response.status !== 200) {
            throw new QuasmError(
                QuasmComponent.STORAGE,
                400,
                ErrorCode.StorageAPI,
                `Failed to delete the object at URL ${requestURL}`
            );
        }
    }
}
