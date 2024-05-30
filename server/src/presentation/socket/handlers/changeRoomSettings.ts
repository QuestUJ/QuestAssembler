import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { UUID } from 'crypto';

import { logger } from '@/infrastructure/logger/Logger';

import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function changeRoomSettingsHandler({
    io,
    socket,
    dataAccess
}: HandlerConfig) {
    socket.on('changeRoomSettings', (data, respond) => {
        withErrorHandling(async () => {
            logger.info(
                QuasmComponent.SOCKET,
                `${socket.data.userID} | SOCKET changeRoomSettings RECEIVED ${data.roomID}`
            );

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
                    `Unauthorized user tried to change room settings of room with ID: ${data.roomID}`
                );
            }

            if (data.maxPlayers < room.characters.getCharacters().length) {
                throw new QuasmError(
                    QuasmComponent.ROOMSETTINGS,
                    400,
                    ErrorCode.PlayerLimitTooSmallForCurrentPlayerCount,
                    `User tried to set the max player count below the current player count`
                );
            }

            await room.roomSettings.setMaxPlayerCount(data.maxPlayers);
            await room.roomSettings.setName(data.name);

            io.in(data.roomID).emit('changeRoomSettings', {
                maxPlayers: data.maxPlayers,
                name: data.name
            }); // I choose to use io.in becouse it will send to the sender too
            // there is an alternative option with sending by socket.to.emit but character settings change will have to happen after successful respond in settingsCharacterChangeHandler

            respond({
                success: true
            });
            logger.info(
                QuasmComponent.SOCKET,
                `${socket.data.userID} | SOCKET changeRoomSettings SUCCESS ${data.roomID}`
            );
        }, respond);
    });
}
