// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { randomUUID } from 'crypto';
import { describe, expect, it, vi } from 'vitest';

import { ICharacterRepository } from '@/repositories/character/ICharacterRepository';

import { Character } from './Character';

describe('Character', () => {
    const fakeRepo: ICharacterRepository = {
        addCharacter: vi.fn().mockReturnValue({}),
        updateCharacter: vi.fn().mockReturnValue({})
    };

    const character = new Character(
        fakeRepo,
        randomUUID(),
        randomUUID(),
        'Nick',
        false,
        'Img',
        'Description'
    );

    const nick = 'New nick';
    const description = 'New description';

    it('should allow changing the nick', async () => {
        await character.setNick(nick);
        expect(character.getNick()).toBe(nick);
    });

    it('should allow changing the description', async () => {
        await character.setDescription(description);
        expect(character.getDescription()).toBe(description);
    });
});
