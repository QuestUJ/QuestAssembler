import { type Server } from 'socket.io';

import { logger } from '@/infrastructure/logger/Logger';

export function startSocketServer(io: Server) {
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

        socket.on('msg', data => {
            console.log(data);
        });
    });
}

declare module 'fastify' {
    interface FastifyInstance {
        io: Server<{
            msg: string;
        }>;
    }
}
