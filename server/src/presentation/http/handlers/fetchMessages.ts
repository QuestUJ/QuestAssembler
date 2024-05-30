import { FetchMessagesResponse, QuasmComponent } from '@quasm/common';
import { UUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { logger } from '@/infrastructure/logger/Logger';
import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { getRoomCheckUser } from './utils';

export function addFetchMessagesHandler(
    fastify: FastifyInstance,
    dataAccess: DataAccessFacade
) {
    fastify.get<{
        Reply: FetchMessagesResponse;
        Querystring: {
            other: string | undefined;
            offset: number | undefined;
            count: number;
        };
        Params: {
            roomId: string;
        };
    }>('/fetchMessages/:roomId', async (request, reply) => {
        logger.info(
            QuasmComponent.HTTP,
            `${request.user.userID} | GET /fetchMessages RECEIVED ${JSON.stringify(request.query)}`
        );

        const room = await getRoomCheckUser({
            roomID: request.params.roomId as UUID,
            userID: request.user.userID,
            roomRepo: dataAccess.roomRepository
        });

        logger.info(QuasmComponent.HTTP, '/fetchMessages Room found');

        const { other, count, offset } = request.query;

        const myCharacter = room.characters.getCharacterByUserID(
            request.user.userID
        );

        logger.info(QuasmComponent.HTTP, '/fetchMessages Character found');

        let result;

        if (!other) {
            result = await room.chats.getBroadcast().fetchMessages({
                count,
                offset
            });

            if (result.length > 0) {
                await room.notifier.markMessageAsRead({
                    characterID: myCharacter.id,
                    messageID: result[result.length - 1].id,
                    senderID: 'broadcast'
                });
            }
        } else {
            const otherCharacter = room.characters.getCharacterByID(
                other as UUID
            );

            result = await room.chats
                .getChat([myCharacter.id, other] as [UUID, UUID])
                .fetchMessages({ count, offset });

            if (result.length > 0) {
                await room.notifier.markMessageAsRead({
                    characterID: myCharacter.id,
                    messageID: result[result.length - 1].id,
                    senderID: otherCharacter.id
                });
            }
        }

        await reply.send({
            success: true,
            payload: result.map(m => ({
                id: m.id,
                content: m.content,
                timestamp: m.timestamp,
                authorName: room.characters.getCharacterByID(m.from).getNick(),
                characterPictureURL: room.characters
                    .getCharacterByID(m.from)
                    .getProfileImageURL()
            }))
        });

        logger.info(
            QuasmComponent.HTTP,
            `${request.user.userID} | GET /fetchMessages SUCCESS ${JSON.stringify(request.query)}`
        );
    });
}
