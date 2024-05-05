import {
    CreateRoomBody,
    CreateRoomResponse,
    ErrorCode,
    JoinRoomBody,
    JoinRoomResponse,
    QuasmComponent,
    QuasmError,
    UserDetails
} from '@quasm/common';
import { FetchRoomsResponse } from '@quasm/common';
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
            const token = req.headers.authorization;
            if (token === undefined) {
                throw new QuasmError(
                    QuasmComponent.SOCKET,
                    401,
                    ErrorCode.MissingAccessToken,
                    `Expected bearer token in headers not found`
                );
            }

            const userDetails = await authProvider.verify(token.split(' ')[1]);

            req.user = userDetails;

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
                    isCurrentUserGameMaster: false,
                    lastImageUrl: undefined,
                    lastMessages: undefined
                }))
            });
        });

        fastify.post<{
            Body: JoinRoomBody;
            Reply: JoinRoomResponse;
        }>('/joinRoom', async (request, reply) => {
            const { gameCode } = request.body;
            logger.info(
                QuasmComponent.HTTP,
                `POST /joinRoom ${gameCode} ${request.user.userID}`
            );

            const room = await roomRepository.getRoomByID(gameCode as UUID);

            await room.addCharacter({
                nick: request.user.nickname,
                userID: request.user.userID
            });

            await reply.send({
                success: true,
                payload: 'ok'
            });
        });

        fastify.post<{
            Body: CreateRoomBody;
            Reply: CreateRoomResponse;
        }>('/createRoom', async (request, reply) => {
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
                nick: request.user.nickname
            });

            await reply.send({
                success: true,
                payload: room.id
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
