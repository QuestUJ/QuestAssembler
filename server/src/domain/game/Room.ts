import { UUID } from 'crypto';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { Character, CharacterDetails } from './Character';
import { ChatMessage, ChatMessageDetails, Chatter } from './ChatMessage';
import { Chat } from './Chat';
import { FromNode } from 'kysely';
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

export class Room {
    private gameMaster?: UUID;
    private characters: Character[] = [];
    private broadcast: Chat;
    private chats: Map<{ from: UUID, to: Chatter }, Chat>;

    constructor(
        readonly roomRepository: IRoomRepository,
        readonly id: UUID,
        private roomSettings: RoomSettings,
        // private storyChunks: StoryChunk[] = [];
    ) {
        this.broadcast = new Chat(roomRepository);
        this.chats = new Map();
    }

    restoreCharacter(character: Character) {
        if (this.characters.length < this.roomSettings.maxPlayerCount) {
            this.characters.push(character);
            if (character.isGameMaster) {
                this.gameMaster = character.id;
            }
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
        if (this.characters.length < this.roomSettings.maxPlayerCount) {
            const character = await this.roomRepository.addCharacter(
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

    getBroadcast(): Chat {
        return this.broadcast;
    }
    
    async addBrodcastMessage(message: ChatMessage): Promise<void> {
        await this.broadcast.addMessage(message);
    }

    getChat(from: UUID, to: Chatter): Chat {
        return this.chats.get({
            from,
            to
        })!;
    }

    async addChatMessage(chatMessageDetails: ChatMessageDetails): Promise<void> {
        await this.chats.get({
            from: chatMessageDetails.from,
            to: chatMessageDetails.to
        })!.addMessage(chatMessageDetails);
    }

    getName(): string {
        return this.roomSettings.roomName;
    }

    async setName(newName: string) {
        if (newName.length >= 1 && newName.length <= MAX_ROOM_NAME_LENGTH) {
            await this.roomRepository.updateRoom(this.id, {
                ...this.roomSettings,
                roomName: newName
            });

            this.roomSettings.roomName = newName;
        }
    }

    getMaxPlayerCount(): number {
        return this.roomSettings.maxPlayerCount;
    }

    async setMaxPlayerCount(newMaxPlayerCount: number) {
        if (newMaxPlayerCount >= 2 && newMaxPlayerCount <= MAX_ROOM_PLAYERS) {
            await this.roomRepository.updateRoom(this.id, {
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
