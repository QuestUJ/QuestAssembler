import { auth } from 'express-oauth2-jwt-bearer';

import { config } from '@/config';

const { AUTH0_DOMAIN, AUTH0_AUDIENCE } = config.pick([
    'AUTH0_DOMAIN',
    'AUTH0_AUDIENCE'
]);

/**
 * Authorization middleware, this will probably be repalced by our own middleware for better control on our side
 */
export const authMiddleware = auth({
    issuerBaseURL: `https://${AUTH0_DOMAIN}`,
    audience: AUTH0_AUDIENCE
});
