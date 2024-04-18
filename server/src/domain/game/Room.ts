import { randomUUID, UUID } from 'crypto';

import { IChatRepository } from '@/repositories/chat/IChatRepository';
import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { Character } from './Character';
import { Chat } from './Chat';
import { ChatMessage } from './ChatMessage';
import { GameSettings } from './GameSettings';
import { StoryChunk } from './StoryChunk';

export class Room {
    readonly id: UUID = randomUUID();
    readonly gameMaster: UUID = randomUUID();
    private gameSettings: GameSettings;
    private storyChunks: StoryChunk[] = [];
    private broadcast: Chat;
    private characters: Character[] = [];

    constructor(roomRepository: IRoomRepository) {
        roomRepository;
        this.storyChunks;
        this.characters;
        this.broadcast = new Chat({} as IChatRepository);
        this.gameSettings = new GameSettings('test', 1);
    }

    addCharacter(character: Character): void {
        character;
    }

    getCharacters(): Character[] {
        return [];
    }

    addStoryChunk(chunk: StoryChunk): void {
        chunk;
    }

    getStoryChunks(): StoryChunk[] {
        return [];
    }

    addBrodcastMessage(message: ChatMessage): void {
        message;
    }

    getBroadcast(): Chat {
        return this.broadcast;
    }

    getGameSettings(): GameSettings {
        return this.gameSettings;
    }

    setName(newName: string): void {
        newName;
    }

    setMaxPlayerCount(newMaxPlayerCount: number): void {
        newMaxPlayerCount;
    }
}
