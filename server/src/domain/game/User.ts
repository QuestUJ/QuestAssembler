import { UUID } from 'crypto';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { Room } from './Room';

export class User {
    constructor(
        readonly roomRepository: IRoomRepository,
        readonly id: UUID,
        private rooms: Room[],
        private profileIMG: string
    ) {
        this.roomRepository = roomRepository;
        this.id = id;
        this.rooms = rooms;
        this.profileIMG = profileIMG;
    }

    getRooms(): Room[] {
        return this.rooms;
    }
}
