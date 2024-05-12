import {
    Ack,
    ErrorMap,
    MsgEvent,
    QuasmComponent,
    QuasmError
} from '@quasm/common';
import { UUID } from 'crypto';

import { logger } from '@/infrastructure/logger/Logger';
import { QuasmSocket } from '@/presentation/socket/socketServer';
import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { IAuthProvider } from '../tools/auth-provider/IAuthProvider';
import { Room } from './Room';

function withErrorHandling<T>(
    respond: (res: Ack<T>) => void,
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

                const characterDetails = {
                    userID: socket.data.userID,
                    nick: nickname,
                    profileIMG: profileImg
                };

                const character = await room.addCharacter(characterDetails);

                respond({
                    success: true
                });

                this.socket.to(room.id).emit('newPlayer', {
                    id: character.id,
                    nick: character.getNick(),
                    profileIMG: characterDetails.profileIMG
                });
            });
        });

        this.socket.on('subscribeToRoom', (id, respond) => {
            withErrorHandling(respond, async () => {
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
                await Promise.all(
                    room.getPrivateChats().map(async chat => {
                        await this.socket.join(JSON.stringify(chat.chatters));
                        await this.socket.join(
                            JSON.stringify(
                                (chat.chatters as [UUID, UUID]).toReversed()
                            )
                        );
                    })
                );

                logger.info(
                    QuasmComponent.SOCKET,
                    `Socket ${this.socket.id} subscribed to ${room.id}`
                );
            });
        });

        this.socket.on(
            'sendMessage',
            ({ roomID, receiver, content }, respond) => {
                withErrorHandling(respond, async () => {
                    logger.info(
                        QuasmComponent.SOCKET,
                        `EVENT: sendMessage: user: ${this.socket.data.userID} in: ${roomID} to: ${receiver}`
                    );

                    const room = await roomRepository.getRoomByID(
                        roomID as UUID
                    );
                    const myCharacter = room.getCharacterByUserID(
                        this.socket.data.userID
                    );

                    const msg = await room
                        .getChat(
                            receiver === 'broadcast'
                                ? 'broadcast'
                                : [myCharacter.id, receiver as UUID]
                        )
                        .addMessage({
                            content,
                            to: receiver as UUID,
                            from: myCharacter.id
                        });

                    const payload: MsgEvent = {
                        roomID: room.id,
                        from: msg.from,
                        authorName: myCharacter.getNick(),
                        content: content,
                        timestamp: msg.timestamp,
                        characterPictureURL: myCharacter.profileIMG
                    };

                    respond({
                        success: true,
                        payload
                    });

                    if (msg.to === 'broadcast') {
                        this.socket.to(room.id).emit('message', payload);
                    } else {
                        this.socket
                            .to(JSON.stringify([msg.from, msg.to]))
                            .emit('message', payload);
                    }

                    logger.info(
                        QuasmComponent.SOCKET,
                        `EVENT SUCCESS: sendMessage: user: ${this.socket.data.userID} in: ${roomID} to: ${receiver}`
                    );
                });
            }
        );
    }

    isMemberOf(room: Room): boolean {
        return !!room
            .getCharacters()
            .find(ch => ch.userID === this.socket.data.userID);
    }
}
