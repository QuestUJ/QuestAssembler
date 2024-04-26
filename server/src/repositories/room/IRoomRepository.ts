import { UUID } from 'crypto';

import { Character, CharacterDetails } from '@/domain/game/Character';
import { Room, RoomSettings } from '@/domain/game/Room';

export interface IRoomRepository {
    createRoom(
        roomDetails: RoomSettings,
        gameMasterDetails: CharacterDetails
    ): Promise<Room>;

    fetchRooms(userID: UUID): Promise<Room[]>;

    getRoomByID(roomID: UUID): Promise<Room>;

    updateRoom(roomID: UUID, roomSettings: RoomSettings): Promise<void>;

    deleteRoom(roomID: UUID): Promise<void>;

    addCharacter(characterDetails: CharacterDetails): Promise<Character>;

    updateCharacter(id: UUID, character: CharacterDetails): Promise<void>;
}
