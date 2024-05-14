import { QuasmComponent } from '@quasm/common';
import { UUID } from 'crypto';

import { logger } from '@/infrastructure/logger/Logger';

import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function changeCharacterSettingsHandler({
    io,
    socket,
    dataAccess
}: HandlerConfig) {
    socket.on('changeCharacterSettings', (data, respond) => {
        withErrorHandling(respond, async () => {
            logger.info(
                QuasmComponent.SOCKET,
                `${socket.data.userID} | SOCKET changeCharacterSettings RECEIVED ${data.roomID}`
            );

            const currentCharacter = (
                await dataAccess.roomRepository.getRoomByID(data.roomID as UUID)
            ).characters.getCharacterByUserID(socket.data.userID);

            await currentCharacter.setNick(data.nick);
            await currentCharacter.setDescription(data.description);

            io.in(data.roomID).emit('changeCharacterDetails', {
                id: currentCharacter.id,
                nick: currentCharacter.getNick(),
                description: currentCharacter.getDescription(),
                profileIMG: currentCharacter.profileIMG
            }); // I choose to use io.in becouse it will send to the sender too
            // there is an alternative option with sending by socket.to.emit but character settings change will have to happen after successful respond in settingsCharacterChangeHandler

            respond({
                success: true
            });
            logger.info(
                QuasmComponent.SOCKET,
                `${socket.data.userID} | SOCKET changeCharacterSettings SUCCESS ${data.roomID}`
            );
        });
    });
}
