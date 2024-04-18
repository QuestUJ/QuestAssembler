import { describe, expect, it } from 'vitest';

import { GameSettings } from './GameSettings';

describe('GameSettings', () => {
    const newName = 'New Room Name';

    const gameSettings = new GameSettings();

    it('should allow changing the room name', () => {
        gameSettings.setRoomName(newName);
        expect(gameSettings.getRoomName()).toBe(newName);
    });

    it('should allow changing the number of maximum players', () => {
        gameSettings.setMaxPlayers(5);
        expect(gameSettings.getMaxPlayers()).toBe(5);
    });

    it('should not allow changing the number of maximum players to 0', () => {
        gameSettings.setMaxPlayers(5);
        gameSettings.setMaxPlayers(0);
        expect(gameSettings.getMaxPlayers()).toBe(5);
    });

    it('should not allow changing the number of maximum players to 1', () => {
        gameSettings.setMaxPlayers(5);
        gameSettings.setMaxPlayers(1);
        expect(gameSettings.getMaxPlayers()).toBe(5);
    });

    it('should not allow changing the number of maximum players to a negative number', () => {
        gameSettings.setMaxPlayers(5);
        gameSettings.setMaxPlayers(-1);
        expect(gameSettings.getMaxPlayers()).toBe(5);
    });
});
