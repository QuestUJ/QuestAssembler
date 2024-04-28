import { UUID } from 'crypto';

import { Character, CharacterDetails } from '@/domain/game/Character';
import { Room, RoomSettings } from '@/domain/game/Room';

/**
 * Main repository that manages instances of Rooms and their persistence
 */
export interface IRoomRepository {
    /**
     * Creates Room with single character (Game master) in it and returns created instance
     */
    createRoom(
        roomDetails: RoomSettings,
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
    updateRoom(roomID: UUID, roomSettings: RoomSettings): Promise<void>;

    /**
     * Destroys Room instance and deletes from persistent storage
     */
    deleteRoom(roomID: UUID): Promise<void>;

    /**
     * Instantiates character based on provided details adds it to Room and persists changes
     */
    addCharacter(
        roomID: UUID,
        characterDetails: CharacterDetails
    ): Promise<Character>;

    /**
     * Just persists some character  attributes changes
     */
    updateCharacter(id: UUID, character: CharacterDetails): Promise<void>;
}
