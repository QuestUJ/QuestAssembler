import { describe, expect, it } from 'vitest';

import { Character } from './Character';

describe('Character', () => {
    const character = new Character();
    const nick = 'Nick';
    const description = 'description';

    it('should allow changing the nick', () => {
        character.setNick(nick);
        expect(character.getNick()).toBe(nick);
    });

    it('should allow changing the description', () => {
        character.setDescription(description);
        expect(character.getDescription()).toBe(description);
    });
});
