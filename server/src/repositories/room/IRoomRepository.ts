import { UUID } from 'crypto';

import { Room } from '@/domain/game/Room';

export interface RoomDetails {
    gameMaster: UUID;
}

export interface IRoomRepository {
    /**
     * instantiates {@link Room} stores it's details in relavant storage and returns created object'
     */
    createRoom(details: RoomDetails): Promise<Room>;
    /**
     * Retrieves rooms with user with given id in them
     */
    fetchRooms(userID: string): Promise<Room[]>;
    /**
     * Retrive room with specific ID
     */
    getRoom(roomID: string): Promise<Room>;
    /**
     * Updates room with given id
     */
    updateRoom(roomID: UUID, details: RoomDetails): void;
    /**
     * Deletes room with given id
     */
    deleteRoom(roomID: UUID): void;
}
