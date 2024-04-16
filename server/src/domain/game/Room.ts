import { randomUUID, UUID } from 'crypto';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { Character } from './Character';
import { Chat } from './Chat';
import { ChatMessage } from './ChatMessage';
import { GameSettings } from './GameSettings';
import { StoryChunk } from './StoryChunk';

export class Room {
    readonly id: UUID = randomUUID();
    readonly gameMaster: UUID = randomUUID();
    private gameSettings: GameSettings = new GameSettings('', 5);
    private storyChunks: StoryChunk[] = [];
    private broadcast: Chat = new Chat();
    private characters: Character[] = [];

    constructor(roomRepository: IRoomRepository) {
        roomRepository;
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
