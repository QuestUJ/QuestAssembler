import { randomUUID } from 'crypto';
import { describe, expect, it, vi } from 'vitest';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { Character } from './Character';
import { Room, RoomSettings } from './Room';
import { PlayerTurnSubmit } from './PlayerTurnSubmit';

describe('Character', () => {
    const fakeRepo: IRoomRepository = {
        getRoomByID: vi.fn().mockReturnValue({}),
        fetchRooms: vi.fn().mockReturnValue({}),
        updateRoom: vi.fn().mockReturnValue({}),
        createRoom: vi.fn().mockReturnValue({}),
        deleteRoom: vi.fn().mockReturnValue({}),
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
        'Description',
        undefined
    );

    const nick = 'New nick';
    const description = 'New description';
    const submit = new PlayerTurnSubmit('whatever');

    it('should allow changing the nick', async () => {
        await character.setNick(nick);
        expect(character.getNick()).toBe(nick);
    });

    it('should allow changing the description', async () => {
        await character.setDescription(description);
        expect(character.getDescription()).toBe(description);
    });

    it('should allow setting PlayerTurnSubmit', async () => {
        await character.setPlayerTurnSubmit(submit);
        expect(character.getPlayerTurnSubmit()).toBe(submit);
    });
});
