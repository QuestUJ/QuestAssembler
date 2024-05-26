import { Config } from '@quasm/common';
import dotenv from 'dotenv';

dotenv.config();

Config.initEnv(process.env);

const configMap = {
    PORT: Config.loadInt('PORT') || 3000,
    NODE_ENV: Config.loadString('NODE_ENV') || 'development',
    ALLOWED_ORIGIN:
        Config.loadString('ALLOWED_ORIGIN') || 'http://localhost:3001',

    PG_USER: Config.loadString('PG_USER') || 'postgres',
    PG_PASSWORD: Config.loadString('PG_PASSWORD') || 'root',
    PG_HOST: Config.loadString('PG_HOST') || 'localhost',
    PG_PORT: Config.loadInt('PG_PORT') || 5434,
    PG_NAME: Config.loadString('PG_NAME') || 'quasm',
    PG_SSL: Config.loadBool('PG_SSL'),

    AUTH0_DOMAIN: Config.loadString('AUTH0_DOMAIN'),
    AUTH0_AUDIENCE: Config.loadString('AUTH0_AUDIENCE'),

    HUGGINGFACE_TOKEN: Config.loadString('HUGGINGFACE_TOKEN'),

    SUPABASE_ACCESS_KEY_ID: Config.loadString('SUPABASE_ACCESS_KEY_ID'),
    SUPABASE_SECRET_ACCESS_KEY: Config.loadString('SUPABASE_SECRET_ACCESS_KEY'),
    SUPABASE_SERVICE_KEY: Config.loadString('SUPABASE_SERVICE_KEY'),
    SUPABASE_CONNECTION_URL: Config.loadString('SUPABASE_CONNECTION_URL')
};

/**
 * object with configuration map, extracts requested configuration, throws error if any of the config is not defined
 * @example example usage
 * ```
 const { AUTH0_DOMAIN, AUTH0_AUDIENCE } = config.pick([
   'AUTH0_DOMAIN',
   'AUTH0_AUDIENCE'
 ]);
* 
 * ```
 */
export const config = new Config(configMap);
