import { Config } from '@quasm/common';

Config.initEnv(import.meta.env);

const configMap = {
  AUTH0_DOMAIN: Config.loadString('VITE_AUTH0_DOMAIN'),
  AUTH0_CLIENTID: Config.loadString('VITE_AUTH0_CLIENTID'),
  AUTH0_AUDIENCE: Config.loadString('VITE_AUTH0_AUDIENCE') || ''
};

export const config = new Config(configMap);
