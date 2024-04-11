import cors from 'cors';
import express from 'express';

import { config } from '@/config';

import { restApi } from './routers/restApi';

const { ALLOWED_ORIGIN, NODE_ENV } = config.pick([
    'ALLOWED_ORIGIN',
    'NODE_ENV'
]);

export const app = express();

app.use(express.static('static'));

if (NODE_ENV === 'development') {
    app.use(
        cors({
            origin: ALLOWED_ORIGIN
        })
    );
}

app.get('/', (_, res) => {
    res.send('hello there');
});

app.use('/api/', restApi);
