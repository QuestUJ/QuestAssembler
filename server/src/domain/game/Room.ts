import {
    ErrorCode,
    MAX_ROOM_NAME_LENGTH,
    MAX_ROOM_PLAYERS,
    QuasmComponent,
    QuasmError
} from '@quasm/common';
import { UUID } from 'crypto';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { Character, CharacterDetails } from './Character';
// import { ChatMessage } from './ChatMessage';
// import { StoryChunk } from './StoryChunk';

// const MAX_STORY_CHUNKS: number = 2000;

export class RoomSettings {
    constructor(
        public roomName: string = '',
        public maxPlayerCount: number = 1
    ) {}
}
export class Room {
    private gameMaster?: UUID;
    private characters: Character[] = [];

    constructor(
        readonly roomRepository: IRoomRepository,
        readonly id: UUID,
        private roomSettings: RoomSettings
        // private storyChunks: StoryChunk[] = [];
        // private broadcast: Chat;
        // private chats: Map<(UUID, UUID), Chat>; ???
    ) {}

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

        this.characters.push(character);
        if (character.isGameMaster) {
            this.gameMaster = character.id;
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

    async addCharacter(characterDetails: CharacterDetails) {
        if (this.characters.length >= this.roomSettings.maxPlayerCount) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                500,
                ErrorCode.MaxPlayersExceeded,
                'Too many characters restored'
            );
        }

        const character = await this.roomRepository.addCharacter(
            this.id,
            characterDetails
        );

        this.characters.push(character);
    }

    // getStoryChunks(): StoryChunk[] {
    //     return this.storyChunks;
    // }

    // addStoryChunk(chunk: StoryChunk) {
    //     if (this.storyChunks.length < MAX_STORY_CHUNKS) {
    //         this.storyChunks.push(chunk);
    //     }
    // }

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
        if (newName.length <= 0 || newName.length > MAX_ROOM_NAME_LENGTH) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                400,
                ErrorCode.MaxRoomName,
                'Incorrect name'
            );
        }

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
        if (newMaxPlayerCount < 2 || newMaxPlayerCount > MAX_ROOM_PLAYERS) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                400,
                ErrorCode.IncorrectMaxPlayers,
                'Incorrect max players'
            );
        }

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
