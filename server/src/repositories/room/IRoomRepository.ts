import { ChunkRange } from '@quasm/common';
import { UUID } from 'crypto';

import { Character, CharacterDetails } from '@/domain/game/Character';
import {
    ChatMessage,
    ChatMessageDetails,
    Chatter
} from '@/domain/game/ChatMessage';
import { Room, RoomSettings } from '@/domain/game/Room';
import { StoryChunk } from '@/domain/game/StoryChunk';

/**
 * Main repository that manages instances of Rooms and their persistence
 */
export interface IRoomRepository {
    fetchStoryChunks(roomID: string, range: ChunkRange): Promise<StoryChunk[]>;
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

    addMessage(chatMessageDetails: ChatMessageDetails): Promise<ChatMessage>;

    fetchMessages(
        from: UUID,
        to: Chatter,
        range: ChunkRange
    ): Promise<ChatMessage[]>;
    /**
     * Just persists some character attributes changes
     */
    updateCharacter(
        id: UUID,
        character: Partial<CharacterDetails>
    ): Promise<void>;
    /**
     * Persists the change of the player's Submit
     */
    setPlayerTurnSubmit(
        id: UUID,
        character: Partial<CharacterDetails>
    ): Promise<void>;

    /**
     * Adds StoryChunk to the specified Room
     */
    addStoryChunk(roomID: UUID, storyChunk: StoryChunk): Promise<StoryChunk>;

    /**
     * Returns the requested part of the story - the StoryChunks specified in ChunkRange
     */
    fetchStory(roomID: UUID, range: ChunkRange): Promise<StoryChunk[]>;
}
