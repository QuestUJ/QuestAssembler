import { Router } from 'express';

import { config } from '@/config';
import { Auth0Provider } from '@/domain/tools/auth-provider/Auth0Provider';

import { authMiddleware } from '../middlewares/auth';

const { AUTH0_AUDIENCE, AUTH0_DOMAIN } = config.pick([
    'AUTH0_DOMAIN',
    'AUTH0_AUDIENCE'
]);

const auth = new Auth0Provider({
    domain: AUTH0_DOMAIN,
    audience: AUTH0_AUDIENCE
});

/**
 * express api router, api routes are defined on this
 */
export const restApi = Router();

restApi.use(authMiddleware);

restApi.get('/test', (req, res) => {
    (async () => {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            const details = await auth.verify(token);
            res.send({
                dets: details
            });

            return;
        }
        res.send({
            hello: 'world',
            pay: req.auth
        });
    })().catch(() => null);
});
