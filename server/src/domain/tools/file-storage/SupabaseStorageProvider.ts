import { IFileStorage } from './IFileStorage';

/**
 * Supabase based file storage
 */
export class SupabaseStorageProvider implements IFileStorage {
    async uploadImage(image: Buffer): Promise<string> {
        image;
        await new Promise(resolve => {
            resolve('');
        });
        return '';
    }
}
