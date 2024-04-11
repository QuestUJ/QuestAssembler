import { type Server as HTTPServer } from 'http';
import { Server } from 'socket.io';

import { config } from '@/config';
import { logger } from '@/infrastructure/logger/Logger';

const { NODE_ENV, ALLOWED_ORIGIN } = config.pick([
    'NODE_ENV',
    'ALLOWED_ORIGIN'
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

export function startSocketServer(server: HTTPServer) {
    const io = new Server(server, ioOptions);
    logger.info('Socket.io Server', 'Socket.io attached');

    io.on('connection', socket => {
        logger.info(
            'Socket.io Server',
            `Received connection from : ${socket.id}`
        );
        socket.on('msg', data => {
            logger.info('Socket.io Server', `Received message: ${data}`);

            setTimeout(() => {
                socket.emit('msg', `Copy that!: ${data}`);
            }, 1000);
        });
    });
}
