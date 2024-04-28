import {
    ErrorCode,
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

        fastify.get('/fetchRooms', async (request, reply) => {
            const rooms = await roomRepository.fetchRooms(
                request.user.userID as UUID
            );

            await reply.send({
                rooms: rooms.map(r => ({
                    id: r.id,
                    roomName: r.getName(),
                    gameMasterName: '',
                    currentPlayers: r.getCharacters.length,
                    maxPlayers: r.getMaxPlayerCount(),
                    isCurrentUserGameMaster: false,
                    lastImageUrl: undefined,
                    lastMessages: undefined
                }))
            });
        });

        fastify.post('/joinRoom', async (request, reply) => {
            const { gameCode } = request.body as { gameCode: string };
            const room = await roomRepository.getRoomByID(gameCode as UUID);

            await room.addCharacter({
                nick: 'Test',
                description: 'test',
                userID: request.user.userID
            });

            await reply.send('ok');
        });

        fastify.post('/createGame', async (request, reply) => {
            const { name, maxPlayers } = request.body as {
                name: string;
                maxPlayers: number;
            };
            const settings = new RoomSettings(name, maxPlayers);
            const room = await roomRepository.createRoom(settings, {
                userID: request.user.userID,
                description: 'test description',
                nick: 'boss'
            });

            await reply.send({
                gameCode: room.id
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
