import { FetchRoomsResponse } from '@quasm/common';
import { UUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { DataAccessFacade } from '@/repositories/DataAccessFacade';

export function addFetchRoomsHandler(
    fastify: FastifyInstance,
    dataAccess: DataAccessFacade
) {
    fastify.get<{
        Reply: FetchRoomsResponse;
    }>('/fetchRooms', async (request, reply) => {
        const rooms = await dataAccess.roomRepository.fetchRooms(
            request.user.userID as UUID
        );

        await reply.send({
            success: true,
            payload: await Promise.all(
                rooms.map(async r => {
                    const lastChunk = (
                        await r.story.fetchStory({ count: 1 })
                    ).shift();

                    const character = r.characters.getCharacterByUserID(
                        request.user.userID
                    );

                    const unreadMessages =
                        await r.notifier.getNumberOfUnreadMessages(
                            character.id
                        );

                    const unreadStory =
                        await r.notifier.getNumberOfUnreadStoryChunks(
                            character.id
                        );

                    const numOfMessages = Object.values(unreadMessages).reduce(
                        (acc, num) => acc + num,
                        0
                    );

                    return {
                        id: r.id,
                        roomName: r.roomSettings.getName(),
                        gameMasterName: r.characters.getGameMaster().getNick(),
                        currentPlayers: r.characters.getCharacters().length,
                        maxPlayers: r.roomSettings.getMaxPlayerCount(),
                        isCurrentUserGameMaster:
                            r.characters.getGameMaster().userID ===
                            request.user.userID,
                        lastImageUrl: lastChunk?.imageURL,
                        lastMessages: lastChunk
                            ? [lastChunk.content]
                            : undefined,
                        numOfUnreadStuff: numOfMessages + unreadStory
                    };
                })
            )
        });
    });
}
