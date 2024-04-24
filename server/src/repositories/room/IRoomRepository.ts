import { UUID } from 'crypto';

import { Character, CharacterDetails } from '@/domain/game/Character';
import { Room, RoomDetails, RoomSettings } from '@/domain/game/Room';

export interface IRoomRepository {
    getRoomByID(roomID: UUID): Promise<Room>;

    fetchRooms(userID: UUID): Promise<Room[]>;

    addCharacter(roomID: UUID, character: CharacterDetails): Character;

    createRoom(roomDetails: RoomDetails): Room;

    deleteRoom(roomID: UUID): void;

    updateRoom(roomSettings: RoomSettings): void;

    updateCharacter(character: CharacterDetails): void;
}
