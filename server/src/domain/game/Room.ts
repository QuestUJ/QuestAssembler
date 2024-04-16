import { randomUUID, UUID } from 'crypto';

import { Character } from './Character';
import { GameSettings } from './GameSettings';
import { StoryChunk } from './StoryChunk';

export class Room {
    readonly id: UUID = randomUUID();
    readonly gameMaster: UUID = randomUUID();
    private gameSettings: GameSettings = new GameSettings('', 5);
    private storyChunks: StoryChunk[] = [];
    private characters: Character[] = [];

    getCharacters(): Character[] {
        return [];
    }

    getStoryChunks(): StoryChunk[] {
        return [];
    }

    getGameSettings(): GameSettings {
        return this.gameSettings;
    }

    setRoomName(newName: string): void {
        newName;
    }

    setMaxPlayerCount(newMaxPlayerCount: number): void {
        newMaxPlayerCount;
    }

    addStoryChunk(chunk: StoryChunk): void {
        chunk;
    }

    addCharacter(character: Character): void {
        character;
    }
}
