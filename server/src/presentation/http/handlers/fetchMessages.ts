import { FetchMessagesResponse } from '@quasm/common';
import { UUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { DataAccessFacade } from '@/repositories/DataAccessFacade';

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
        const room = await dataAccess.roomRepository.getRoomByID(
            request.params.roomId as UUID
        );
        const { other, count, offset } = request.query;

        const myCharacter = room.characters.getCharacterByUserID(
            request.user.userID
        );
        let result;

        if (!other) {
            result = await room.chats.getBroadcast().fetchMessages({
                count,
                offset
            });
        } else {
            result = await room.chats
                .getChat([myCharacter.id, other] as [UUID, UUID])
                .fetchMessages({ count, offset });
        }

        const otherCharacter = room.characters.getCharacterByID(other as UUID);

        await reply.send({
            success: true,
            payload: result.map(m => ({
                id: m.id,
                content: m.content,
                timestamp: m.timestamp,
                authorName:
                    m.from === other
                        ? otherCharacter.getNick()
                        : myCharacter.getNick(),
                characterPictureURL:
                    m.from === other
                        ? otherCharacter.profileIMG
                        : myCharacter.profileIMG
            }))
        });
    });
}
