import { randomUUID } from 'crypto';
import { describe, expect, it, vi } from 'vitest';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { Character } from './Character';
import { Room, RoomSettings } from './Room';

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

    const room: Room = new Room(
        fakeRepo,
        randomUUID(),
        randomUUID(),
        new RoomSettings('Room name', 5),
        []
    );

    const character = new Character(
        fakeRepo,
        randomUUID(),
        randomUUID(),
        undefined,
        room,
        'Nick',
        'Description',
        undefined
    );

    const nick = 'New nick';
    const description = 'New description';

    it('should allow changing the nick', () => {
        character.setNick(nick);
        expect(character.getNick()).toBe(nick);
    });

    it('should allow changing the description', () => {
        character.setDescription(description);
        expect(character.getDescription()).toBe(description);
    });
});
