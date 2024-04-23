import cors from '@fastify/cors';
import { QuasmError } from '@quasm/common';
import Fastify from 'fastify';
import FastifyIO from 'fastify-socket.io';

import { config } from '@/config';
import { Auth0Provider } from '@/domain/tools/auth-provider/Auth0Provider';
import { logger } from '@/infrastructure/logger/Logger';

import { apiRoutes } from './plugins/api';

const { ALLOWED_ORIGIN, NODE_ENV, AUTH0_AUDIENCE, AUTH0_DOMAIN } = config.pick([
    'ALLOWED_ORIGIN',
    'NODE_ENV',
    'AUTH0_DOMAIN',
    'AUTH0_AUDIENCE'
]);

export async function startHTTPServer() {
    const app = Fastify();

    app.setErrorHandler(async (error, _, reply) => {
        if (error instanceof QuasmError) {
            logger.error(error.errorLocation, error.message);
            await reply.status(error.statusCode).send({
                message: error.message,
                location: error.errorLocation
            });
        } else {
            await reply.send(error);
        }
    });

    if (NODE_ENV === 'development') {
        await app.register(cors, {
            origin: ALLOWED_ORIGIN
        });
    }

    await app.register(
        FastifyIO,
        NODE_ENV === 'development'
            ? {
                  cors: {
                      origin: ALLOWED_ORIGIN
                  }
              }
            : {}
    );

    const auth0 = new Auth0Provider({
        domain: AUTH0_DOMAIN,
        audience: AUTH0_AUDIENCE
    });

    await app.register(apiRoutes(auth0), {
        prefix: '/api/v1'
    });

    return app;
}
