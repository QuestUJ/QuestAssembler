import { Config } from '@quasm/common';

const configMap = {
  AUTH0_DOMAIN:
    Config.loadString('AUTH0_DOMAIN') || 'dev-cut6p8lm7mviao58.us.auth0.com',
  AUTH0_CLIENTID:
    Config.loadString('AUTH0_CLIENTID') || 'ssI1HRw1boSFw3L0Eb54GBoi0VYdM5Eh'
};

export const config = new Config(configMap);
