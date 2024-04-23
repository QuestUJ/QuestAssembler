import { ErrorLocation, QuasmError } from '@quasm/common';
import {
    type FastifyInstance,
    type FastifyPluginOptions,
    type FastifyRequest
} from 'fastify';

import {
    IAuthProvider,
    UserDetails
} from '@/domain/tools/auth-provider/IAuthProvider';

export function apiRoutes(authProvider: IAuthProvider) {
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

        done();
    };
}

declare module 'fastify' {
    export interface FastifyRequest {
        user: UserDetails;
    }
}
