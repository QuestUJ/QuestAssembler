import {
    ErrorCode,
    MAX_ROOM_NAME_LENGTH,
    MAX_ROOM_PLAYERS,
    QuasmComponent,
    QuasmError
} from '@quasm/common';
import { UUID } from 'crypto';

import { logger } from '@/infrastructure/logger/Logger';
import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { Character, CharacterDetails } from './Character';
// import { ChatMessage } from './ChatMessage';
import { StoryChunk } from './StoryChunk';

const MAX_STORY_CHUNKS: number = 2000;

export interface Range {
    offset: number | undefined; // id of the last message (undefined when we only want 'count')
    count: number; // how many messages/story chunks preceding that ID we want
}
export class RoomSettings {
    constructor(
        public roomName: string = '',
        public maxPlayerCount: number = 1
    ) {}
}

export class Room {
    private characters: Character[] = [];

    constructor(
        readonly roomRepository: IRoomRepository,
        readonly id: UUID,
        private roomSettings: RoomSettings,
        private storyChunks: StoryChunk[] = []
        // private broadcast: Chat;
        // private chats: Map<(UUID, UUID), Chat>; ???
    ) {
        this.validateName(this.getName());
        this.validateMaxPlayerCount(this.getMaxPlayerCount());
    }

    validateName(name: string) {
        if (name.length <= 0 || name.length > MAX_ROOM_NAME_LENGTH) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            throw new QuasmError(
                QuasmComponent.ROOM,
                400,
                ErrorCode.MaxRoomName,
                'Incorrect name'
            );
        }
    }

    validateMaxPlayerCount(count: number) {
        if (count < 2 || count > MAX_ROOM_PLAYERS) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                400,
                ErrorCode.IncorrectMaxPlayers,
                'Incorrect max players'
            );
        }
    }

    validateCharacter(character: CharacterDetails) {
        if (this.characters.length >= this.roomSettings.maxPlayerCount) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                500,
                ErrorCode.MaxPlayersExceeded,
                'Too many characters restored'
            );
        }

        if (this.characters.find(({ userID }) => userID === character.userID)) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                400,
                ErrorCode.UserExists,
                `Room: ${this.id} User: ${character.userID}`
            );
        }
    }

    /**
     * Helper method for reassigning character to the Room, for adding new character to the room use {@link addCharacter}
     */
    restoreCharacter(character: Character) {
        if (this.characters.length >= this.roomSettings.maxPlayerCount) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                500,
                ErrorCode.MaxPlayersExceeded,
                'Too many characters restored'
            );
        }

        logger.info(
            QuasmComponent.ROOM,
            `Restoring character: ${character.id}`
        );

        this.characters.push(character);
        if (character.isGameMaster) {
            logger.info(
                QuasmComponent.ROOM,
                `Game master restored: ${character.id}`
            );
        }
    }

    getRoomSettings(): RoomSettings {
        return this.roomSettings;
    }

    hasUser(userId: UUID): boolean {
        return !!this.characters.find(
            character => character.getUserID() === userId
        );
    }

    getCharacters(): Character[] {
        return this.characters;
    }

    getGameMaster(): Character {
        console.log(this.characters)
        return this.characters.find(ch => ch.isGameMaster)!;
    }

    async addCharacter(characterDetails: CharacterDetails) {
        this.validateCharacter(characterDetails);

        const character = await this.roomRepository.addCharacter(
            this.id,
            characterDetails
        );

        this.characters.push(character);
    }

    fetchStory(range: Range): Promise<StoryChunk[]> {
        return this.roomRepository.fetchStory(this.id, range);
    }

    addStoryChunk(chunk: StoryChunk): Promise<StoryChunk> {
        if (chunk.content.length > MAX_STORY_CHUNKS) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                400,
                ErrorCode.MaxRoomName, //change this to a new error code
                'Exceeded StoryChunk length'
            );
        }
        return this.roomRepository.addStoryChunk(this.id, chunk);
    }

    // getBroadcast(): Chat {
    //     return this.broadcast;
    // }

    // addBrodcastMessage(message: ChatMessage) {
    //     message;
    // }

    getName(): string {
        return this.roomSettings.roomName;
    }

    async setName(newName: string) {
        this.validateName(newName);

        await this.roomRepository.updateRoom(this.id, {
            ...this.roomSettings,
            roomName: newName
        });

        this.roomSettings.roomName = newName;
    }

    getMaxPlayerCount(): number {
        return this.roomSettings.maxPlayerCount;
    }

    async setMaxPlayerCount(newMaxPlayerCount: number) {
        this.validateMaxPlayerCount(newMaxPlayerCount);

        await this.roomRepository.updateRoom(this.id, {
            ...this.roomSettings,
            maxPlayerCount: newMaxPlayerCount
        });

        this.roomSettings.maxPlayerCount = newMaxPlayerCount;
    }

    hasEmptySlot(): boolean {
        return this.characters.length < this.getMaxPlayerCount();
    }
}
