import { UUID } from 'crypto';

import { Character, CharacterDetails } from '@/domain/game/Character';
import { Room, RoomSettings } from '@/domain/game/Room';
import { ChatMessage, ChatMessageDetails, Chatter } from '@/domain/game/ChatMessage';
import { Range } from '@/domain/game/Chat';

export interface IRoomRepository {
    createRoom(
        roomDetails: RoomSettings,
        gameMasterDetails: CharacterDetails
    ): Promise<Room>;

    fetchRooms(userID: UUID): Promise<Room[]>;

    getRoomByID(roomID: UUID): Promise<Room>;

    updateRoom(roomID: UUID, roomSettings: RoomSettings): Promise<void>;

    deleteRoom(roomID: UUID): Promise<void>;

    addCharacter(
        roomID: UUID,
        characterDetails: CharacterDetails
    ): Promise<Character>;

    updateCharacter(
        characterID: UUID,
        character: CharacterDetails
    ): Promise<void>;

    addMessage(chatMessageDetails: ChatMessageDetails): Promise<ChatMessage>;

    fetchMessages(from: UUID, to: Chatter, range: Range): Promise<ChatMessage[]>;
}
