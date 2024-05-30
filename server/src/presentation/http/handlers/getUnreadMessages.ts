import { GetUnreadMessagesResponse } from '@quasm/common';
import { UUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { getRoomCheckUser } from './utils';

export function addGetUnreadMessagesHandler(
    fastify: FastifyInstance,
    dataAccess: DataAccessFacade
) {
    fastify.get<{
        Params: {
            roomId: string;
        };
        Reply: GetUnreadMessagesResponse;
    }>('/getUnreadMessages/:roomId', async (request, reply) => {
        const room = await getRoomCheckUser({
            roomID: request.params.roomId as UUID,
            userID: request.user.userID,
            roomRepo: dataAccess.roomRepository
        });

        const character = room.characters.getCharacterByUserID(
            request.user.userID
        );

        const unreadMessages = await room.notifier.getNumberOfUnreadMessages(
            character.id
        );

        await reply.send({
            success: true,
            payload: unreadMessages
        });
    });
}
