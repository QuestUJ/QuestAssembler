import { ICharacterRepository } from 'src/repositories/Character/ICharacterRepository';
import { describe, expect, it, vi } from 'vitest';

import { User } from './User';

const fakeRepo: ICharacterRepository = {
    fetchCharacters: vi.fn().mockReturnValue([
        { id: 'character1', userId: 'user1', roomId: 'room1' },
        { id: 'character2', userId: 'user1', roomId: 'room2' }
    ])
};

describe('User', () => {
    const user = new User(fakeRepo);

    it('should correctly fetch rooms based on characters', async () => {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const rooms = await user.getRooms();
        expect(rooms).toEqual(['room1', 'room2']);
    });
});
