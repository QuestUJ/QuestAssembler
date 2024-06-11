import { CreateRoomBody, CreateRoomResponse } from '@quasm/common';
import { FastifyInstance } from 'fastify';

import { DataAccessFacade } from '@/repositories/DataAccessFacade';

export function addCreateRoomHandler(
    fastify: FastifyInstance,
    dataAccess: DataAccessFacade
) {
    fastify.post<{
        Body: CreateRoomBody;
        Reply: CreateRoomResponse;
    }>('/createRoom', async (request, reply) => {
        const { name, maxPlayers } = request.body as {
            name: string;
            maxPlayers: number;
        };

        const room = await dataAccess.roomRepository.createRoom(
            {
                roomName: name,
                maxPlayerCount: maxPlayers
            },
            {
                userID: request.user.userID,
                nick: request.user.nickname,
                profileIMG: request.user.profileImg
            }
        );

        await reply.send({
            success: true,
            payload: room.id
        });
    });
}
