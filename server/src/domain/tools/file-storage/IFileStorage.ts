/**
 * File storage interface
 */
export interface IFileStorage {
    /**
     * uploads Image
     */
    uploadImage(image: Buffer, roomId: string): Promise<string>;
}
