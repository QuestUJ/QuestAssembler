import {
    ErrorCode,
    QuasmComponent,
    QuasmError,
    UserDetails
} from '@quasm/common';
import {
    type FastifyInstance,
    type FastifyPluginOptions,
    type FastifyRequest
} from 'fastify';

import { IAuthProvider } from '@/domain/tools/auth-provider/IAuthProvider';
import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { addCreateRoomHandler } from '../handlers/createRoom';
import { addFetchMessagesHandler } from '../handlers/fetchMessages';
import { addFetchRoomsHandler, fetchRooms } from '../handlers/fetchRooms';
import { addGetRoomHandler } from '../handlers/getRoom';

export function apiRoutes(
    authProvider: IAuthProvider,
    dataAccess: DataAccessFacade
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

        addFetchRoomsHandler(fastify, dataAccess);
        addGetRoomHandler(fastify, dataAccess);
        addCreateRoomHandler(fastify, dataAccess);
        addFetchMessagesHandler(fastify, dataAccess);

        done();
    };
}

declare module 'fastify' {
    export interface FastifyRequest {
        user: UserDetails;
    }
}
