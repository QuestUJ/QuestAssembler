import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { UUID } from 'crypto';

import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function submitStoryHandler({
    socket,
    dataAccess,
    io,
    fileStorageProvider
}: HandlerConfig) {
    socket.on('submitStory', (submit, respond) => {
        withErrorHandling(respond, async () => {
            const room = await dataAccess.roomRepository.getRoomByID(
                submit.roomID as UUID
            );

            const character = room.characters.getCharacterByUserID(
                socket.data.userID
            );

            if (!character.isGameMaster) {
                throw new QuasmError(
                    QuasmComponent.SOCKET,
                    400,
                    ErrorCode.UnauthorizedStorySubmit,
                    `${socket.data.userID} tried to submit story`
                );
            }

            let imageURL = '';
            if (submit.image) {
                imageURL = await fileStorageProvider.uploadImage(
                    submit.image,
                    submit.roomID
                );
            }
            const chunk = await room.story.addStoryChunk({
                title: 'test ',
                content: submit.story,
                imageURL: imageURL
            });

            respond({
                success: true,
                payload: {
                    id: chunk.id,
                    title: chunk.title,
                    content: chunk.content,
                    imageURL: chunk.imageURL
                }
            });

            io.to(room.id).emit('newTurn', {
                id: chunk.id,
                title: chunk.title,
                story: chunk.content,
                imageURL: chunk.imageURL
            });
        });
    });
}
