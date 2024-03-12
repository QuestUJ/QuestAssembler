import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { ALLOWED_ORIGIN, NODE_ENV, PORT } from './env';

const app = express();
const server = http.createServer(app);

const ioOptions =
    NODE_ENV === 'production'
        ? {}
        : {
              cors: {
                  origin: ALLOWED_ORIGIN
              }
          };

console.log(ioOptions);
const io = new Server(server, ioOptions);

io.on('connection', socket => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('msg', data => {
        console.log('client has sent this: ', data);
        setTimeout(() => {
            socket.emit('msg', `Copy that!: ${data}`);
        }, 1000);
    });
});

app.use(express.static('static'));

app.get('/', (_, res) => {
    res.send('hello there');
});

server.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
