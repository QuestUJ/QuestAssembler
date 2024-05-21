import { DeleteRoomResponse, QuasmComponent } from '@quasm/common';
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
            `${request.user.userID} | POST /deleteRoom RECEIVED ${request.params.roomID}`
        );

        try {
            await dataAccess.roomRepository.deleteRoom(
                request.params.roomID as UUID
            );

            await reply.send({
                success: true,
                payload: `Room ${request.params.roomID} deleted successfully`
            });

            logger.info(
                QuasmComponent.HTTP,
                `${request.user.userID} | POST /deleteRoom SUCCESS ${request.params.roomID}`
            );
        } catch (error) {
            logger.error(
                QuasmComponent.HTTP,
                `Error deleting room ${request.params.roomID}`
            );

            await reply.status(500).send({
                success: false,
                error: { message: 'Failed to delete room' }
            });
        }
    });
}
