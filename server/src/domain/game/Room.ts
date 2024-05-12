import {
    ChunkRange,
    ErrorCode,
    MAX_ROOM_NAME_LENGTH,
    MAX_ROOM_PLAYERS,
    MAX_STORY_CHUNK_LENGTH,
    QuasmComponent,
    QuasmError
} from '@quasm/common';
import { UUID } from 'crypto';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { Character, CharacterDetails } from './Character';
import { Chat } from './Chat';
import { ChatMessage, ChatParticipants } from './ChatMessage';
import { StoryChunk } from './StoryChunk';

export class RoomSettings {
    constructor(
        public roomName: string = '',
        public maxPlayerCount: number = 1
    ) {}
}

export class Room {
    private characters: Character[] = [];
    private broadcast: Chat;
    private chats: Map<string, Chat>;

    constructor(
        private readonly roomRepository: IRoomRepository,
        readonly id: UUID,
        private roomSettings: RoomSettings,
        private storyChunks: StoryChunk[] = []
    ) {
        this.validateName(this.getName());
        this.validateMaxPlayerCount(this.getMaxPlayerCount());
        this.broadcast = new Chat(this.roomRepository, 'broadcast', this.id);
        this.chats = new Map();
    }

    validateName(name: string) {
        if (name.length <= 0 || name.length > MAX_ROOM_NAME_LENGTH) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                400,
                ErrorCode.MaxRoomName,
                'Room name too long'
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

        this.characters.push(character);
    }

    /**
     * Helper method for respawning chats, typically called after raeding from db for example
     */
    spawnChats() {
        for (let i = 0; i < this.characters.length; i++) {
            for (let j = i + 1; j < this.characters.length; j++) {
                const chat = new Chat(
                    this.roomRepository,
                    [this.characters[i].id, this.characters[j].id],
                    this.id
                );
                this.chats.set(JSON.stringify(chat.chatters), chat);
            }
        }

        this.broadcast = new Chat(this.roomRepository, 'broadcast', this.id);
    }

    getRoomSettings(): RoomSettings {
        return this.roomSettings;
    }

    hasUser(userId: UUID): boolean {
        return !!this.characters.find(character => character.userID === userId);
    }

    getCharacters(): Character[] {
        return this.characters;
    }

    getCharacterByUserID(userID: string): Character {
        const character = this.characters.find(ch => ch.userID === userID);
        if (!character) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                404,
                ErrorCode.CharacterNotFound,
                `looked for userID: ${userID}`
            );
        }

        return character;
    }

    getCharacterByID(id: UUID): Character {
        const character = this.characters.find(ch => ch.id === id);
        if (!character) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                404,
                ErrorCode.CharacterNotFound,
                id
            );
        }

        return character;
    }

    getGameMaster(): Character {
        return this.characters.find(ch => ch.isGameMaster)!;
    }

    async addCharacter(characterDetails: CharacterDetails) {
        this.validateCharacter(characterDetails);

        const character = await this.roomRepository.addCharacter(
            this.id,
            characterDetails
        );

        this.characters.forEach(other => {
            const chat = new Chat(
                this.roomRepository,
                [other.id, character.id],
                this.id
            );
            this.chats.set(JSON.stringify(chat.chatters), chat);
        });

        this.characters.push(character);

        return character;
    }

    fetchStory(range: ChunkRange): Promise<StoryChunk[]> {
        return this.roomRepository.fetchStory(this.id, range);
    }

    addStoryChunk(chunk: StoryChunk): Promise<StoryChunk> {
        if (chunk.content.length > MAX_STORY_CHUNK_LENGTH) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                400,
                ErrorCode.ChunkLengthExceeded,
                'Story Chunk length exceeded'
            );
        }
        return this.roomRepository.addStoryChunk(this.id, chunk);
    }

    getBroadcast(): Chat {
        return this.broadcast;
    }

    async addBrodcastMessage(message: ChatMessage): Promise<void> {
        await this.broadcast.addMessage(message);
    }

    getPrivateChats() {
        return [...this.chats.values()];
    }

    getChat(participants: ChatParticipants): Chat {
        if (participants === 'broadcast') {
            return this.broadcast;
        }
        const chat = this.chats.get(JSON.stringify(Chat.toId(participants)));

        if (!chat) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                500,
                ErrorCode.MissingChat,
                participants.join(',')
            );
        }

        return chat;
    }

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
