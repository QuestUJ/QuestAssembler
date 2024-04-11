import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth';

/**
 * express api router, api routes are defined on this
 */
export const restApi = Router();

restApi.use(authMiddleware);

restApi.get('/test', (req, res) => {
    res.send({
        hello: 'world',
        pay: req.auth
    });
});
