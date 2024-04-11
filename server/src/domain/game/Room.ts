import { randomUUID, UUID } from 'crypto';

import { Character } from './Character';
import { GameSettings } from './GameSettings';
import { StoryChunk } from './StoryChunk';

export class Room {
    readonly id: UUID = randomUUID();
    readonly gameMaster: UUID = randomUUID();

    getCharacters(): Character[] {
        return [];
    }

    getStoryChunks(): StoryChunk[] {
        return [];
    }

    getGameSettings(): GameSettings {
        return new GameSettings();
    }
}
