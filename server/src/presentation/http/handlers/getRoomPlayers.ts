import { GetRoomPlayersResponse } from '@quasm/common';
import { UUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { getRoomCheckUser } from './utils';

export function addGetRoomPlayersHandler(
    fastify: FastifyInstance,
    dataAccess: DataAccessFacade
) {
    fastify.get<{
        Params: {
            roomId: string;
        };
        Reply: GetRoomPlayersResponse;
    }>('/getRoomPlayers/:roomId', async (request, reply) => {
        const room = await getRoomCheckUser({
            roomID: request.params.roomId as UUID,
            userID: request.user.userID,
            roomRepo: dataAccess.roomRepository
        });

        const players = room.characters
            .getCharacters()
            .filter(p => p.userID !== request.user.userID);

        await reply.send({
            success: true,
            payload: players.map(p => ({
                id: p.id,
                nick: p.getNick(),
                profileIMG: p.profileIMG,
                isReady: !!p.getTurnSubmit()
            }))
        });
    });
}
