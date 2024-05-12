import {
    CreateRoomBody,
    CreateRoomResponse,
    ErrorCode,
    FetchMessagesResponse,
    FetchRoomsResponse,
    GetRoomResponse,
    QuasmComponent,
    QuasmError,
    UserDetails
} from '@quasm/common';
import { UUID } from 'crypto';
import {
    type FastifyInstance,
    type FastifyPluginOptions,
    type FastifyRequest
} from 'fastify';

import { RoomSettings } from '@/domain/game/Room';
import { IAuthProvider } from '@/domain/tools/auth-provider/IAuthProvider';
import { logger } from '@/infrastructure/logger/Logger';
import { IRoomRepository } from '@/repositories/room/IRoomRepository';

export function apiRoutes(
    authProvider: IAuthProvider,
    roomRepository: IRoomRepository
) {
    return (
        fastify: FastifyInstance,
        _: FastifyPluginOptions,
        done: () => void
    ) => {
        fastify.decorateRequest('user', null);

        fastify.addHook('preHandler', async (req: FastifyRequest) => {
            const tokenString = req.headers.authorization;
            if (tokenString === undefined) {
                throw new QuasmError(
                    QuasmComponent.SOCKET,
                    401,
                    ErrorCode.MissingAccessToken,
                    `Expected bearer token in headers not found`
                );
            }

            const token = tokenString.split(' ')[1];

            const [userID, details] = await Promise.all([
                authProvider.verify(token),
                authProvider.fetchUserDetails(token)
            ]);

            req.user = {
                userID,
                email: details.email,
                nickname: details.nickname,
                profileImg: details.profileImg
            };

            done();
        });

        fastify.get<{
            Reply: FetchRoomsResponse;
        }>('/fetchRooms', async (request, reply) => {
            const rooms = await roomRepository.fetchRooms(
                request.user.userID as UUID
            );

            await reply.send({
                success: true,
                payload: rooms.map(r => ({
                    id: r.id,
                    roomName: r.getName(),
                    gameMasterName: r.getGameMaster().getNick(),
                    currentPlayers: r.getCharacters().length,
                    maxPlayers: r.getMaxPlayerCount(),
                    isCurrentUserGameMaster:
                        r.getGameMaster().userID === request.user.userID,
                    lastImageUrl: undefined,
                    lastMessages: undefined
                }))
            });
        });

        fastify.get<{
            Reply: GetRoomResponse;

            Params: {
                roomID: string;
            };
        }>('/getRoom/:roomID', async (request, reply) => {
            const room = await roomRepository.getRoomByID(
                request.params.roomID as UUID
            );

            const players = [...room.getCharacters()];
            const currentPlayer = players.splice(
                players.findIndex(p => p.userID === request.user.userID),
                1
            )[0];

            await reply.send({
                success: true,
                payload: {
                    id: room.id,
                    roomName: room.getName(),
                    gameMasterID: room.getGameMaster().id,
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
        });

        fastify.post<{
            Body: CreateRoomBody;
            Reply: CreateRoomResponse;
        }>('/createRoom', async (request, reply) => {
            // FOR VALIDATION TESTING
            /* await reply.send({
                success: false,
                error: {
                    location: QuasmComponent.DATABASE,
                    code: 500,
                    message: "lol"
                }
            }) */
            const { name, maxPlayers } = request.body as {
                name: string;
                maxPlayers: number;
            };
            const settings = new RoomSettings(name, maxPlayers);

            logger.info(
                QuasmComponent.HTTP,
                `POST /createRoom ${JSON.stringify(request.body)}`
            );

            const room = await roomRepository.createRoom(settings, {
                userID: request.user.userID,
                nick: request.user.nickname,
                profileIMG: request.user.profileImg
            });

            await reply.send({
                success: true,
                payload: room.id
            });
        });

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
            const room = await roomRepository.getRoomByID(
                request.params.roomId as UUID
            );
            const { other, count, offset } = request.query;

            const myCharacter = room.getCharacterByUserID(request.user.userID);
            let result;

            if (!other) {
                result = await room.getBroadcast().fetchMessages({
                    count,
                    offset
                });
            } else {
                result = await room
                    .getChat([myCharacter.id, other] as [UUID, UUID])
                    .fetchMessages({ count, offset });
            }

            const otherCharacter = room.getCharacterByID(other as UUID);

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

        done();
    };
}

declare module 'fastify' {
    export interface FastifyRequest {
        user: UserDetails;
    }
}
