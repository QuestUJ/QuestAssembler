import { UUID } from 'crypto';

import { CharacterDetails } from '@/domain/game/character/Character';
import { Room } from '@/domain/game/room/Room';
import { RoomSettingsDetails } from '@/domain/game/room/RoomSettings';

export interface IRoomRepository {
    /**
     * Creates Room with single character (Game master) in it and returns created instance
     */
    createRoom(
        roomDetails: RoomSettingsDetails,
        gameMasterDetails: CharacterDetails
    ): Promise<Room>;

    /**
     * Returns all Rooms that user has access to
     */
    fetchRooms(userID: UUID): Promise<Room[]>;

    /**
     * Returns Room with specified id
     */
    getRoomByID(roomID: UUID): Promise<Room>;

    /**
     * Just persists soome room attributes changes
     */
    updateRoom(
        roomID: UUID,
        roomSettings: Partial<RoomSettingsDetails>
    ): Promise<void>;

    /**
     * Destroys Room instance and deletes from persistent storage
     */
    deleteRoom(roomID: UUID): Promise<void>;
}
