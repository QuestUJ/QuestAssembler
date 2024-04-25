import { Config } from '@quasm/common';

Config.initEnv(import.meta.env);

const configMap = {
  AUTH0_DOMAIN:
    Config.loadString('VITE_AUTH0_DOMAIN') ||
    'dev-cut6p8lm7mviao58.us.auth0.com',
  AUTH0_CLIENTID:
    Config.loadString('VITE_AUTH0_CLIENTID') ||
    'ssI1HRw1boSFw3L0Eb54GBoi0VYdM5Eh',
  AUTH0_AUDIENCE: Config.loadString('VITE_AUTH0_AUDIENCE') || '',
  // BASE_URL without ending slash
  API_BASE_URL:
    Config.loadString('VITE_API_BASE_URL') || 'http://localhost:3000'
};

export const config = new Config(configMap);
