import { GetUnreadStoryResponse } from '@quasm/common';
import { UUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { getRoomCheckUser } from './utils';

export function addGetUnreadStoryHandler(
    fastify: FastifyInstance,
    dataAccess: DataAccessFacade
) {
    fastify.get<{
        Params: {
            roomId: string;
        };
        Reply: GetUnreadStoryResponse;
    }>('/getUnreadStory/:roomId', async (request, reply) => {
        const room = await getRoomCheckUser({
            roomID: request.params.roomId as UUID,
            userID: request.user.userID,
            roomRepo: dataAccess.roomRepository
        });

        const character = room.characters.getCharacterByUserID(
            request.user.userID
        );

        const unreadMessages = await room.notifier.getNumberOfUnreadStoryChunks(
            character.id
        );

        await reply.send({
            success: true,
            payload: unreadMessages
        });
    });
}
