import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { QuasmError } from '@quasm/common';
import Fastify from 'fastify';
import FastifyIO from 'fastify-socket.io';
import path from 'path';

import { config } from '@/config';
import { IAuthProvider } from '@/domain/tools/auth-provider/IAuthProvider';
import { logger } from '@/infrastructure/logger/Logger';
import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { apiRoutes } from './plugins/api';

const { ALLOWED_ORIGIN, NODE_ENV } = config.pick([
    'ALLOWED_ORIGIN',
    'NODE_ENV'
]);

export async function startHTTPServer(
    roomRepository: IRoomRepository,
    authProvider: IAuthProvider
) {
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

    await app.register(fastifyStatic, {
        root: path.join(__dirname, '..', 'static')
    });

    await app.register(apiRoutes(authProvider, roomRepository), {
        prefix: '/api/v1'
    });

    app.setNotFoundHandler(async (_, reply) => {
        await reply.sendFile('index.html');
    });

    return app;
}
