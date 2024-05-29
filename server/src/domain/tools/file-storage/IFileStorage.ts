/**
 * File storage interface
 */
export interface IFileStorage {
    /**
     * uploads Image
     */
    uploadImage(image: Blob, roomId: string): Promise<string>;
    deleteImageAtPublicURL(url: string): Promise<void>;
}
