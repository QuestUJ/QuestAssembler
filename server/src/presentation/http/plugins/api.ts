import {
    ErrorCode,
    QuasmComponent,
    QuasmError,
    UserDetails
} from '@quasm/common';
import chalk from 'chalk';
import {
    type FastifyInstance,
    type FastifyPluginOptions,
    type FastifyRequest
} from 'fastify';

import { IAIAssistant } from '@/domain/tools/ai-assistant/IAIAssistant';
import { IAuthProvider } from '@/domain/tools/auth-provider/IAuthProvider';
import { logger } from '@/infrastructure/logger/Logger';
import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { addCreateRoomHandler } from '../handlers/createRoom';
import { addFetchMessagesHandler } from '../handlers/fetchMessages';
import { addFetchRoomsHandler } from '../handlers/fetchRooms';
import { addFetchStoryHandler } from '../handlers/fetchStory';
import { addFetchTurnSubmitsHandler } from '../handlers/fetchTurnSubmits';
import { addGenerateTextHandler } from '../handlers/generateText';
import { addGetRoomHandler } from '../handlers/getRoom';
import { addGetRoomPlayersHandler } from '../handlers/getRoomPlayers';
import { addGetTurnSubmitHandler } from '../handlers/getTurnSubmit';
import { addGetUnreadMessagesHandler } from '../handlers/getUnreadMessages';
import { addGetUnreadStoryHandler } from '../handlers/getUnreadStory';

export function apiRoutes(
    authProvider: IAuthProvider,
    dataAccess: DataAccessFacade,
    aiAssistant: IAIAssistant
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
                    QuasmComponent.HTTP,
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

            let methodStyle = chalk.bold;
            if (req.method === 'GET') {
                methodStyle = methodStyle.greenBright;
            } else if (req.method === 'POST') {
                methodStyle = methodStyle.redBright;
            }

            logger.info(QuasmComponent.HTTP, [
                chalk.green(req.user.userID),
                methodStyle(req.method),
                req.url
            ]);

            done();
        });

        addFetchRoomsHandler(fastify, dataAccess);
        addGetRoomHandler(fastify, dataAccess);
        addCreateRoomHandler(fastify, dataAccess);
        addFetchMessagesHandler(fastify, dataAccess);
        addGenerateTextHandler(fastify, aiAssistant);
        addGetTurnSubmitHandler(fastify, dataAccess);
        addFetchTurnSubmitsHandler(fastify, dataAccess);
        addGetRoomPlayersHandler(fastify, dataAccess);
        addFetchStoryHandler(fastify, dataAccess);
        addGetUnreadStoryHandler(fastify, dataAccess);
        addGetUnreadMessagesHandler(fastify, dataAccess);

        done();
    };
}

declare module 'fastify' {
    export interface FastifyRequest {
        user: UserDetails;
    }
}
