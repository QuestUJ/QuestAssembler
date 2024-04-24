import { UUID } from 'crypto';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { Character, CharacterDetails } from './Character';
// import { ChatMessage } from './ChatMessage';
// import { StoryChunk } from './StoryChunk';

const MAX_ROOM_NAME_LENGTH: number = 128;
const MAX_ROOM_PLAYERS: number = 10;
// const MAX_STORY_CHUNKS: number = 2000;

export class RoomSettings {
    constructor(
        public roomName: string = '',
        public maxPlayerCount: number = 1
    ) {
        this.roomName = roomName;
        this.maxPlayerCount = maxPlayerCount;
    }
}

export interface RoomDetails {
    readonly gameMaster: UUID;
    readonly roomSettings: RoomSettings;
    readonly characters: Character[];
}

export class Room {
    constructor(
        readonly roomRepository: IRoomRepository,
        readonly id: UUID,
        readonly gameMaster: UUID,
        private roomSettings: RoomSettings,
        private characters: Character[]
        // private storyChunks: StoryChunk[] = [];
        // private broadcast: Chat;
        // private chats: Map<(UUID, UUID), Chat>; ???
    ) {
        this.roomRepository = roomRepository;
        this.id = id;
        this.gameMaster = gameMaster;
        this.characters = characters;
        this.roomSettings = roomSettings;
    }

    getRoomDetails(): RoomDetails {
        return {
            gameMaster: this.gameMaster,
            roomSettings: this.roomSettings,
            characters: this.characters
        };
    }

    hasUser(userId: UUID): boolean {
        return !!this.characters.find(
            character => character.getUserID() === userId
        );
    }

    getCharacters(): Character[] {
        return this.characters;
    }

    addCharacter(characterDetails: CharacterDetails) {
        if (this.characters.length < this.roomSettings.maxPlayerCount) {
            const character = this.roomRepository.addCharacter(
                this.id,
                characterDetails
            );

            this.characters.push(character);
        }
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

    setName(newName: string) {
        if (newName.length >= 1 && newName.length <= MAX_ROOM_NAME_LENGTH) {
            this.roomRepository.updateRoom({
                ...this.roomSettings,
                roomName: newName
            });

            this.roomSettings.roomName = newName;
        }
    }

    getMaxPlayerCount(): number {
        return this.roomSettings.maxPlayerCount;
    }

    setMaxPlayerCount(newMaxPlayerCount: number) {
        if (newMaxPlayerCount >= 2 && newMaxPlayerCount <= MAX_ROOM_PLAYERS) {
            this.roomRepository.updateRoom({
                ...this.roomSettings,
                maxPlayerCount: newMaxPlayerCount
            });

            this.roomSettings.maxPlayerCount = newMaxPlayerCount;
        }
    }

    hasEmptySlot(): boolean {
        return this.characters.length < this.getMaxPlayerCount();
    }
}
