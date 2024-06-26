import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { ErrorMap, QuasmError } from '@quasm/common';
import Fastify from 'fastify';
import FastifyIO from 'fastify-socket.io';
import path from 'path';

import { config } from '@/config';
import { IAIAssistant } from '@/domain/tools/ai-assistant/IAIAssistant';
import { IAuthProvider } from '@/domain/tools/auth-provider/IAuthProvider';
import { logger } from '@/infrastructure/logger/Logger';
import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { apiRoutes } from './plugins/api';

const { ALLOWED_ORIGIN, NODE_ENV } = config.pick([
    'ALLOWED_ORIGIN',
    'NODE_ENV'
]);

/**
 * it will spin up an fastify HTTP server for REST API and serving prebuilt static files
 */
export async function startHTTPServer(
    dataAccess: DataAccessFacade,
    authProvider: IAuthProvider,
    aiAssistant: IAIAssistant
) {
    const app = Fastify();

    app.setErrorHandler(async (error, _, reply) => {
        if (error instanceof QuasmError) {
            logger.error(error.errorLocation, [
                `ErrorCode: ${error.errorCode}, Context: ${error.message}`
            ]);
            await reply.status(error.statusCode).send({
                success: false,
                error: {
                    message: ErrorMap[error.errorCode],
                    location: error.errorLocation,
                    code: error.errorCode
                }
            });
        } else {
            console.log(error);
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

    const staticPath =
        NODE_ENV === 'development'
            ? path.join(__dirname, '..', '..', '..', 'static')
            : path.join(__dirname, '..', 'static');

    await app.register(fastifyStatic, {
        root: staticPath
    });

    await app.register(apiRoutes(authProvider, dataAccess, aiAssistant), {
        prefix: '/api/v1'
    });

    app.setNotFoundHandler(async (_, reply) => {
        await reply.sendFile('index.html');
    });

    return app;
}
