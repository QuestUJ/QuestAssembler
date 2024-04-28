import { UserDetails } from '@quasm/common';

import { QuasmSocket } from '@/presentation/socket/socketServer';
import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { Character } from './Character';
import { Room } from './Room';

export class User {
    constructor(
        private socket: QuasmSocket,
        private readonly userDetails: UserDetails,
        private readonly roomRepository: IRoomRepository
    ) {
        // Separate joining and subscribing, client should now if he needs to join or subbscribe based on REST API info

        // One event for adding user to room,
        this.socket.on('joinRoom', async (id, character, respond) => {
            const room = await this.roomRepository.getRoom(id);

            if (this.isMemberOf(room)) {
                respond({
                    success: false,
                    error: 'You already are in that room'
                });
                return;
            }

            // handle adding character here

            character;
            room.addCharacter(new Character());

            respond({
                success: true
            });
        });

        this.socket.on('subscribeToRoom', async (id, respond) => {
            const room = await this.roomRepository.getRoom(id);

            if (!this.isMemberOf(room)) {
                respond({
                    success: false,
                    error: "You don't belong to this room"
                });

                return;
            }

            // Subsribe to room events
            await this.socket.join('room channel');
            await this.socket.join('me - player1 channel');
            await this.socket.join('me - player2 channel');
        });
    }

    isMemberOf(room: Room): boolean {
        return !!room
            .getCharacters()
            .find(ch => ch.getUserID() === this.userDetails.userID);
    }
}

