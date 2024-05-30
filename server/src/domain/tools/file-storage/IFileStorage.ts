/**
 * File storage interface
 */
export interface IFileStorage {
    /**
     * uploads Image
     */
    uploadImage(image: Uint8Array, roomId: string): Promise<string>;
    deleteImageAtPublicURL(url: string): Promise<void>;
    uploadAvatar(
        image: Uint8Array,
        roomId: string,
        oldAvatarURL?: string
    ): Promise<string>;
}
