import { ErrorLocation, QuasmError } from '@quasm/common';
import { UUID } from 'crypto';
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
            await reply.send({
                hello: 'there',
                user: request.user
            });
        });

        fastify.get(
            '/room/:roomID/details',
            async (
                request: FastifyRequest<{ Params: { roomID: UUID } }>,
                reply
            ) => {
                const userID = request.user.userID as UUID;

                const room = await roomRepository.getRoomByID(
                    request.params.roomID
                );

                if (room.hasUser(userID)) {
                    await reply.send(JSON.stringify(room.getRoomDetails()));
                }

                if (room.hasEmptySlot()) {
                    throw new QuasmError(
                        ErrorLocation.VALIDATION,
                        500,
                        'User is not in the room'
                    );
                } else {
                    throw new QuasmError(
                        ErrorLocation.VALIDATION,
                        500,
                        'Room is full already'
                    );
                }
            }
        );

        fastify.get(
            '/room/:roomID/join',
            async (
                request: FastifyRequest<{
                    Params: {
                        roomID: UUID;
                        characterDetails: CharacterDetails;
                    };
                }>,
                reply
            ) => {
                const room = await roomRepository.getRoomByID(
                    request.params.roomID
                );

                if (room.hasEmptySlot()) {
                    room.addCharacter(request.params.characterDetails);
                    await reply.send();
                } else {
                    throw new QuasmError(
                        ErrorLocation.VALIDATION,
                        500,
                        'Room is full already'
                    );
                }
            }
        );

        done();
    };
}

declare module 'fastify' {
    export interface FastifyRequest {
        user: UserDetails;
    }
}
