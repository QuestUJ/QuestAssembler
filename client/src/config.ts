import { Config } from '@quasm/common';

Config.initEnv(import.meta.env);

const configMap = {
  AUTH0_DOMAIN: Config.loadString('VITE_AUTH0_DOMAIN'),
  AUTH0_CLIENTID: Config.loadString('VITE_AUTH0_CLIENTID'),
  AUTH0_AUDIENCE: Config.loadString('VITE_AUTH0_AUDIENCE'),
  // BASE_URL without ending slash
  API_BASE_URL:
    Config.loadString('VITE_API_BASE_URL') || 'http://localhost:3000',
  SOCKET_URL: Config.loadString('VITE_SOCKET_URL') || 'http://localhost:3000'
};

export const config = new Config(configMap);
