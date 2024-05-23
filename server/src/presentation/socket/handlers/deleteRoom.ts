import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { UUID } from 'crypto';

import { logger } from '@/infrastructure/logger/Logger';

import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function deleteRoomHandler({ io, socket, dataAccess }: HandlerConfig) {
    socket.on('deleteRoom', (data, respond) => {
        withErrorHandling(respond, async () => {
            logger.info(
                QuasmComponent.SOCKET,
                `${socket.data.userID} | SOCKET deleteRoom RECEIVED ${data.roomID}`
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
                    `Unauthorized user tried to delete room with ID: ${data.roomID}`
                );
            }

            await dataAccess.roomRepository.deleteRoom(data.roomID as UUID);

            io.in(data.roomID).emit('roomDeletion');

            respond({
                success: true
            });
            logger.info(
                QuasmComponent.SOCKET,
                `${socket.data.userID} | SOCKET deleteRoom SUCCESS ${data.roomID}`
            );
        });
    });
}
