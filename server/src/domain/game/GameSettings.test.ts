import { describe, expect, it } from 'vitest';

import { Character } from './Character';
import { Room } from './Room';

describe('GameSettings', () => {
    const room = new Room();
    const newName = 'New Room Name';
    const character = new Character();

    it('should allow adding characters', () => {
        room.addCharacter(character);
        expect(room.getCharacters()).toContain(character);
    });

    it('should allow changing the room name', () => {
        room.setRoomName(newName);
        expect(room.getGameSettings().roomName).toBe(newName);
    });

    it('should allow changing the number of maximum players', () => {
        room.setMaxPlayerCount(5);
        expect(room.getGameSettings().maxPlayerCount).toBe(5);
    });

    room.setMaxPlayerCount(5);

    it('should not allow changing the number of maximum players to 0', () => {
        room.setMaxPlayerCount(0);
        expect(room.getGameSettings().maxPlayerCount).toBe(5);
    });

    it('should not allow changing the number of maximum players to 1', () => {
        room.setMaxPlayerCount(1);
        expect(room.getGameSettings().maxPlayerCount).toBe(5);
    });

    it('should not allow changing the number of maximum players to a negative number', () => {
        room.setMaxPlayerCount(-1);
        expect(room.getGameSettings().maxPlayerCount).toBe(5);
    });
});
