import { FetchRoomsResponse, QuasmComponent } from '@quasm/common';
import { UUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { logger } from '@/infrastructure/logger/Logger';
import { DataAccessFacade } from '@/repositories/DataAccessFacade';

export function addFetchRoomsHandler(
    fastify: FastifyInstance,
    dataAccess: DataAccessFacade
) {
    fastify.get<{
        Reply: FetchRoomsResponse;
    }>('/fetchRooms', async (request, reply) => {
        logger.info(
            QuasmComponent.HTTP,
            `${request.user.userID} | GET /fetchRooms RECEIVED`
        );

        const rooms = await dataAccess.roomRepository.fetchRooms(
            request.user.userID as UUID
        );

        await reply.send({
            success: true,
            payload: rooms.map(r => ({
                id: r.id,
                roomName: r.roomSettings.getName(),
                gameMasterName: r.characters.getGameMaster().getNick(),
                currentPlayers: r.characters.getCharacters().length,
                maxPlayers: r.roomSettings.getMaxPlayerCount(),
                isCurrentUserGameMaster:
                    r.characters.getGameMaster().userID === request.user.userID,
                lastImageUrl: undefined,
                lastMessages: undefined
            }))
        });

        logger.info(
            QuasmComponent.HTTP,
            `${request.user.userID} | GET /fetchRooms SUCCESS `
        );
    });
}
