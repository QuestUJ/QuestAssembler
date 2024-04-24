import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Room } from '@/domain/game/Room';
import { Database } from '@/infrastructure/postgres/db';

import { IRoomRepository, RoomDetails } from './IRoomRepository';

/**
 * Postgres based implementation of {@link IRoomRepository}
 */
export class RoomRepositoryPostgres implements IRoomRepository {
    constructor(db: Kysely<Database>) {
        db;
        Kysely;
    }

    /**
     * Creates room entry in postgres and returns it's {@link Room} instance
     */
    async createRoom(details: RoomDetails): Promise<Room> {
        await new Promise(() => details);
        return new Room(this);
    }

    /**
     * Retrieves rooms with user with given id in them
     */
    async fetchRooms(userID: string): Promise<Room[]> {
        userID;
        return new Promise(resolve => resolve([]));
    }

    async getRoom(roomID: string): Promise<Room> {
        roomID;
        return new Promise(resolve => resolve(new Room(this)));
    }

    /**
     * Updates room with given id
     */
    updateRoom(roomID: UUID, details: RoomDetails): void {
        roomID;
        details;
    }

    /**
     * Deletes room with given id
     */
    deleteRoom(roomID: UUID): void {
        roomID;
    }
}
