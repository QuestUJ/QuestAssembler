import { Ack, ErrorMap, QuasmComponent, QuasmError } from '@quasm/common';
import { UUID } from 'crypto';

import { logger } from '@/infrastructure/logger/Logger';
import { QuasmSocket } from '@/presentation/socket/socketServer';
import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { IAuthProvider } from '../tools/auth-provider/IAuthProvider';
import { Room } from './Room';

function withErrorHandling(
    respond: (res: Ack) => void,
    handler: () => void | Promise<void>
) {
    const err = (error: unknown) => {
        if (error instanceof QuasmError) {
            logger.error(
                error.errorLocation,
                `ErrorCode: ${error.errorCode}, Context: ${error.message}`
            );

            respond({
                error: ErrorMap[error.errorCode],
                success: false
            });
        } else {
            console.log(error);
            respond({
                success: false,
                error: 'Unexpected error!'
            });
        }
    };

    try {
        const result = handler();
        if (result instanceof Promise) {
            result.catch(err);
        }
    } catch (e) {
        err(e);
    }
}

export class User {
    constructor(
        private socket: QuasmSocket,
        private readonly roomRepository: IRoomRepository,
        private readonly authProvider: IAuthProvider
    ) {
        this.socket.on('joinRoom', (roomID, respond) => {
            withErrorHandling(respond, async () => {
                const room = await this.roomRepository.getRoomByID(
                    roomID as UUID
                );

                const { nickname, profileImg } =
                    await this.authProvider.fetchUserDetails(
                        this.socket.data.token
                    );

                const character = {
                    userID: socket.data.userID,
                    nick: nickname,
                    profileIMG: profileImg
                };

                await room.addCharacter(character);

                respond({
                    success: true
                });

                this.socket.to(room.id).emit('newPlayer', character);
            });
        });

        this.socket.on('subscribeToRoom', async (id, respond) => {
            const room = await this.roomRepository.getRoomByID(id as UUID);

            if (!this.isMemberOf(room)) {
                respond({
                    success: false,
                    error: "You don't belong to this room"
                });

                return;
            }

            // Subsribe to room events
            await this.socket.join(room.id);
            logger.info(
                QuasmComponent.SOCKET,
                `Socket ${this.socket.id} subscribed to ${room.id}`
            );
        });
    }

    isMemberOf(room: Room): boolean {
        return !!room
            .getCharacters()
            .find(ch => ch.userID === this.socket.data.userID);
    }
}
