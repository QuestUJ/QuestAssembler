import 'dotenv/config';

import { QuasmComponent } from '@quasm/common';

import { config } from './config';
import { HuggingFaceAiAssistant } from './domain/tools/ai-assistant/HuggingFaceAIAssistant';
import { Auth0Provider } from './domain/tools/auth-provider/Auth0Provider';
import { SupabaseStorageProvider } from './domain/tools/file-storage/SupabaseStorageProvider';
import { logger } from './infrastructure/logger/Logger';
import { db } from './infrastructure/postgres/db';
import { startHTTPServer } from './presentation/http/httpServer';
import {
    QuasmSocketServer,
    startSocketServer
} from './presentation/socket/socketServer';
import { CharacterRepositoryPostgres } from './repositories/character/CharacterRepositoryPostgres';
import { ChatRepositoryPostgres } from './repositories/chat/ChatRepositoryPostgres';
import { DataAccessFacade } from './repositories/DataAccessFacade';
import { NotifierRepositoryPostgres } from './repositories/notifier/NotifierRepositoryPostgres';
import { RoomRepositoryPostgres } from './repositories/room/RoomRepositoryPostgres';
import { StoryRepositoryPostgres } from './repositories/story/StoryRepositoryPostgres';

const {
    PORT,
    AUTH0_DOMAIN,
    AUTH0_AUDIENCE,
    HUGGINGFACE_TOKEN,
    SUPABASE_SERVICE_KEY,
    SUPABASE_CONNECTION_URL
} = config.pick([
    'PORT',
    'AUTH0_DOMAIN',
    'AUTH0_AUDIENCE',
    'HUGGINGFACE_TOKEN',
    'SUPABASE_SERVICE_KEY',
    'SUPABASE_CONNECTION_URL'
]);

(async () => {
    const roomRepo = new RoomRepositoryPostgres(db);
    const dataAccess = new DataAccessFacade(
        roomRepo,
        new CharacterRepositoryPostgres(db),
        new ChatRepositoryPostgres(db),
        new StoryRepositoryPostgres(db),
        new NotifierRepositoryPostgres(db)
    );

    roomRepo.provideDataAccess(dataAccess);

    const auth0 = new Auth0Provider({
        domain: AUTH0_DOMAIN,
        audience: AUTH0_AUDIENCE
    });

    const aiAssistant = new HuggingFaceAiAssistant(HUGGINGFACE_TOKEN);

    const fileStorageProvider = new SupabaseStorageProvider(
        SUPABASE_CONNECTION_URL,
        SUPABASE_SERVICE_KEY
    );

    const app = await startHTTPServer(dataAccess, auth0, aiAssistant); // right now fileStorage not included in http
    startSocketServer(app.io, dataAccess, auth0, fileStorageProvider);

    await app.listen({ port: PORT, host: '0.0.0.0' });

    logger.info(QuasmComponent.HTTP, `Started successfully on port: ${PORT}`);
})().catch(err => logger.error(QuasmComponent.HTTP, `Failed to start: ${err}`));

declare module 'fastify' {
    interface FastifyInstance {
        io: QuasmSocketServer;
    }
}
