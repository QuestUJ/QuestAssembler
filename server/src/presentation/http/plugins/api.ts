import { ErrorLocation, QuasmError } from '@quasm/common';
import { randomUUID } from 'crypto';
import {
    type FastifyInstance,
    type FastifyPluginOptions,
    type FastifyRequest
} from 'fastify';

import { CharacterDetails } from '@/domain/game/Character';
import {
    IAuthProvider,
    UserDetails
} from '@/domain/tools/auth-provider/IAuthProvider';
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
        /** FOR TESTING ONLY */
        const rooms = [
            {
                id: randomUUID(),
                roomName: 'test 1',
                gameMasterName: 'Mariusz Pudzianowski',
                currentPlayers: 5,
                maxPlayers: 6,
                isCurrentUserGameMaster: true,
                lastImageUrl: undefined,
                lastMessages: undefined
            },
            {
                id: randomUUID(),
                roomName: 'test 2',
                gameMasterName: 'Kolmogorov',
                currentPlayers: 3,
                maxPlayers: 7,
                isCurrentUserGameMaster: false,
                lastImageUrl: undefined,
                lastMessages: undefined
            }
        ];

        fastify.decorateRequest('user', null);

        fastify.addHook('preHandler', async (req: FastifyRequest) => {
            const token = req.headers.authorization;
            if (token === undefined) {
                throw new QuasmError(
                    ErrorLocation.AUTH,
                    401,
                    'Unauthorized, missing access token'
                );
            }

            const userDetails = await authProvider.verify(token.split(' ')[1]);

            req.user = userDetails;

            done();
        });

        fastify.get('/test', async (request, reply) => {
            return await reply.send({
                hello: 'there',
                user: request.user
            });
        });

        fastify.get('/fetchRooms', async (request, reply) => {
            // get user details from the preHandler auth hook
            //const userID = request.user.userID;

            // call db and fetch rooms with that userID
            // const response = await fetchRooms(...);
            // mock response

            await reply.send({
                rooms: rooms
            });
            /**
             * expects object {rooms: RoomResponse[]} where ResponseRoom:
                type RoomResponse = {
                    id: UUID;
                    roomName: string;
                    gameMasterName: string;
                    currentPlayers: number;
                    maxPlayers: number;
                    isCurrentUserGameMaster: boolean;
                    lastImageUrl: string | undefined;
                    lastMessages: string[] | undefined;
                };
             */
        });

        fastify.post('/joinGame', async (request, reply) => {
            // get user details from the preHandler auth hook
            //const userID = request.user.userID;
            //const gameCode = request.body.gameCode;
            //calldb and see if joining the room is even possible
            //mock response
            rooms.push({
                id: randomUUID(),
                roomName: 'test 3',
                gameMasterName: 'Kolmogorov 2',
                currentPlayers: 35,
                maxPlayers: 78,
                isCurrentUserGameMaster: false,
                lastImageUrl: undefined,
                lastMessages: undefined
            });

            await reply.code(200);
            /**
             * expects just the response code:
             * - 200 is everything ok
             * - anything else is bad
             */
        });

        fastify.post('/createGame', async (request, reply) => {
            // get user details from the preHandler auth hook
            //const userID = request.user.userID;
            //const maxNumberOfPlayers = request.body.maxPlayers;
            //const roomName = request.body.name;
            //calldb and see if creating the room is even possible
            //mock response
            rooms.push({
                id: randomUUID(),
                roomName: 'test 7',
                gameMasterName: 'Kolmogorov 2',
                currentPlayers: 35,
                maxPlayers: 78,
                isCurrentUserGameMaster: true,
                lastImageUrl: undefined,
                lastMessages: undefined
            });
            await reply.code(200).send({
                gameCode: rooms[rooms.length - 1].id
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
