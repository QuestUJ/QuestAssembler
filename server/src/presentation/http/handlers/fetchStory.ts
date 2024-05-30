import { FetchStoryResponse } from '@quasm/common';
import { UUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { getRoomCheckUser } from './utils';

export function addFetchStoryHandler(
    fastify: FastifyInstance,
    dataAccess: DataAccessFacade
) {
    fastify.get<{
        Reply: FetchStoryResponse;
        Querystring: {
            other: string | undefined;
            offset: number | undefined;
            count: number;
        };
        Params: {
            roomId: string;
        };
    }>('/fetchStory/:roomId', async (request, reply) => {
        const room = await getRoomCheckUser({
            roomID: request.params.roomId as UUID,
            userID: request.user.userID,
            roomRepo: dataAccess.roomRepository
        });

        const story = await room.story.fetchStory({
            count: request.query.count,
            offset: request.query.offset
        });

        await reply.send({
            success: true,
            payload: story.map(s => ({
                id: s.id,
                content: s.content,
                imageURL: s.imageURL
            }))
        });
    });
}
