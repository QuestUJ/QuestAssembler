import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import http from 'http';
import { Server } from 'socket.io';

import { config } from './config';
import { getUserProfile } from './infrastructure/auth0';

const app = express();
const server = http.createServer(app);

const { PORT, AUTH0_DOMAIN, AUTH0_AUDIENCE, ALLOWED_ORIGIN, NODE_ENV } =
    config.pick([
        'PORT',
        'ALLOWED_ORIGIN',
        'AUTH0_AUDIENCE',
        'AUTH0_DOMAIN',
        'NODE_ENV'
    ]);

const ioOptions =
    NODE_ENV === 'production'
        ? {}
        : {
              cors: {
                  origin: ALLOWED_ORIGIN,
                  methods: ['GET'],
                  allowedHeaders: ['Authorization', 'Content-type'],
                  maxAge: 86400
              }
          };

const authMiddleware = auth({
    issuerBaseURL: AUTH0_DOMAIN,
    audience: AUTH0_AUDIENCE
});

const io = new Server(server, ioOptions);

io.on('connection', async socket => {
    console.log(`Socket connected: ${socket.id}`);

    if ('token' in socket.handshake.auth) {
        const { token } = socket.handshake.auth as { token: string };
        console.log(await getUserProfile(token));
    }

    socket.on('msg', data => {
        console.log('client has sent this: ', data);
        setTimeout(() => {
            socket.emit('msg', `Copy that!: ${data}`);
        }, 1000);
    });
});

app.use(express.static('static'));
app.use(
    cors({
        origin: ALLOWED_ORIGIN,
        methods: ['GET'],
        allowedHeaders: ['Authorization', 'Content-type'],
        maxAge: 86400
    })
);

app.get('/', (_, res) => {
    res.send('hello there');
});

app.get('/api/test', authMiddleware, (req, res) => {
    res.send({ hello: 'world', pay: req.auth });
});

server.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
