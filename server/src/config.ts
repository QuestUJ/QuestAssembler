import { Config } from '@quasm/common';

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
    AUTH0_DOMAIN:
        Config.loadString('AUTH)_DOMAIN') ||
        'dev-cut6p8lm7mviao58.us.auth0.com',
    AUTH0_AUDIENCE: Config.loadString('AUTH0_AUDIENCE')
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
