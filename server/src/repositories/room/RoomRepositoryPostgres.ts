import { UUID } from 'crypto';

import { Room } from '@/domain/game/Room';

import { IRoomRepository } from './IRoomRepository';

export class RoomRepositoryPostgres implements IRoomRepository {
    fetchRooms(userId: UUID): Room[] {
        userId;
        return [];
    }

    updateRoom(): void {}

    createRoom(): Room {
        return new Room();
    }

    deleteRoom(): void {}
}
