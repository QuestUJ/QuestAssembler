import {
    QuasmComponent,
    DeleteRoomResponse
} from '@quasm/common';
import { UUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { logger } from '@/infrastructure/logger/Logger';
import { DataAccessFacade } from '@/repositories/DataAccessFacade';

export function addDeleteRoomHandler(
    fastify: FastifyInstance,
    dataAccess: DataAccessFacade
) {
    fastify.delete<{
        Reply: DeleteRoomResponse;
        Params: {
            roomID: string;
        };
    }>('/deleteRoom/:roomID', async (request, reply) => {
        logger.info(
            QuasmComponent.HTTP,
            `${request.user.userID} | DELETE /deleteRoom RECEIVED ${request.params.roomID}`
        );

        
        await dataAccess.roomRepository.deleteRoom(request.params.roomID as UUID);

        await reply.send({
                success: true
        });

            logger.info(
                QuasmComponent.HTTP,
                `${request.user.userID} | DELETE /deleteRoom SUCCESS ${request.params.roomID}`
            );
    });
}

