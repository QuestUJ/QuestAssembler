import { describe, expect, it, vi } from 'vitest';

import { ICharacterRepository } from '@/repositories/character/ICharacterRepository';

import { Character } from './Character';
import { User } from './User';

const fakeRepo: ICharacterRepository = {
    createCharacter: async details => {
        details;

        return new Promise(resolve => resolve({} as Character));
    },
    fetchCharacters: vi.fn().mockReturnValue([
        { id: 'character1', userId: 'user1', roomId: 'room1' },
        { id: 'character2', userId: 'user1', roomId: 'room2' }
    ])
};

describe('User', () => {
    const user = new User(fakeRepo);

    it('should correctly fetch rooms based on characters', () => {
        const rooms = user.getRooms();
        expect(rooms).toEqual(['room1', 'room2']);
    });
});
