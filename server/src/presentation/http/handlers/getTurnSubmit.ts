import { GetTurnSubmitResponse } from '@quasm/common';
import { UUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { getRoomCheckUser } from './utils';

export function addGetTurnSubmitHandler(
    fastify: FastifyInstance,
    dataAccess: DataAccessFacade
) {
    fastify.get<{
        Params: {
            roomId: string;
        };
        Reply: GetTurnSubmitResponse;
    }>('/getTurnSubmit/:roomId', async (request, reply) => {
        const room = await getRoomCheckUser({
            roomID: request.params.roomId as UUID,
            userID: request.user.userID,
            roomRepo: dataAccess.roomRepository
        });

        const character = room.characters.getCharacterByUserID(
            request.user.userID
        );

        const submit = character.getTurnSubmit();

        if (submit === null) {
            await reply.send({
                success: true,
                payload: null
            });

            return;
        }

        const { content, timestamp } = submit;

        await reply.send({
            success: true,
            payload: {
                content,
                timestamp: timestamp.toISOString()
            }
        });
    });
}
