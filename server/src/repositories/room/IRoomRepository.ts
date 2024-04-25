import { UUID } from 'crypto';

import { Character, CharacterDetails } from '@/domain/game/Character';
import { Room, RoomDetails, RoomSettings } from '@/domain/game/Room';

export interface IRoomRepository {
    createRoom(roomDetails: RoomDetails): Promise<Room>;

    fetchRooms(userID: UUID): Promise<Room[]>;

    getRoomByID(roomID: UUID): Promise<Room>;

    updateRoom(roomID: UUID, roomSettings: RoomSettings): Promise<void>;

    deleteRoom(roomID: UUID): Promise<void>;

    addCharacter(characterDetails: CharacterDetails): Promise<Character>;

    updateCharacter(character: CharacterDetails): Promise<void>;
}
