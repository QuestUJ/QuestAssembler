import { GetRoomResponse, QuasmComponent } from '@quasm/common';
import { UUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { logger } from '@/infrastructure/logger/Logger';
import { DataAccessFacade } from '@/repositories/DataAccessFacade';

export function addGetRoomHandler(
    fastify: FastifyInstance,
    dataAccess: DataAccessFacade
) {
    fastify.get<{
        Reply: GetRoomResponse;

        Params: {
            roomID: string;
        };
    }>('/getRoom/:roomID', async (request, reply) => {
        logger.info(
            QuasmComponent.HTTP,
            `${request.user.userID} | GET /getRoom RECEIVED ${request.params.roomID}`
        );

        const room = await dataAccess.roomRepository.getRoomByID(
            request.params.roomID as UUID
        );

        const players = [...room.characters.getCharacters()];
        const currentPlayer = players.splice(
            players.findIndex(p => p.userID === request.user.userID),
            1
        )[0];

        await reply.send({
            success: true,
            payload: {
                id: room.id,
                roomName: room.roomSettings.getName(),
                gameMasterID: room.characters.getGameMaster().id,
                players: players.map(p => ({
                    id: p.id,
                    nick: p.getNick(),
                    profilePicture: p.profileIMG
                })),
                currentPlayer: {
                    id: currentPlayer.id,
                    nick: currentPlayer.getNick(),
                    profilePicture: currentPlayer.profileIMG
                }
            }
        });

        logger.info(
            QuasmComponent.HTTP,
            `${request.user.userID} | GET /getRoom SUCCESS ${request.params.roomID}`
        );
    });
}
