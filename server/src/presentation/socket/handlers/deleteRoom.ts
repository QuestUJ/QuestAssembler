import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { UUID } from 'crypto';

import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function deleteRoomHandler({
    io,
    socket,
    dataAccess,
    fileStorageProvider
}: HandlerConfig) {
    socket.on('deleteRoom', (data, respond) => {
        withErrorHandling(async () => {
            const room = await dataAccess.roomRepository.getRoomByID(
                data.roomID as UUID
            );
            const senderCharacter = room.characters.getCharacterByUserID(
                socket.data.userID
            );

            if (room.characters.getGameMaster().id !== senderCharacter.id) {
                throw new QuasmError(
                    QuasmComponent.ROOMSETTINGS,
                    401,
                    ErrorCode.UnauthorizedSettingsChange,
                    `Unauthorized user tried to delete room with ID: ${data.roomID}`
                );
            }

            const avatarURLs = room.characters
                .getCharacters()
                .map(character => character.getProfileImageURL())
                .filter(
                    (url: string | undefined): url is string =>
                        url !== undefined && url !== ''
                );

            for (const url of avatarURLs) {
                await fileStorageProvider.deleteImageAtPublicURL(url);
            }

            const storyChunkImagesURLs = (
                await room.story.fetchAllStoryChunks()
            )
                .map(storyChunk => storyChunk.imageURL)
                .filter(
                    (url: string | undefined): url is string =>
                        url !== undefined && url !== ''
                );

            for (const url of storyChunkImagesURLs) {
                await fileStorageProvider.deleteImageAtPublicURL(url);
            }

            await dataAccess.roomRepository.deleteRoom(data.roomID as UUID);

            io.in(data.roomID).emit('roomDeletion');

            respond({
                success: true
            });
        }, respond);
    });
}
