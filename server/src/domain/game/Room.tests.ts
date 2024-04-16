import { randomUUID } from 'crypto';
import { describe, expect, it, vi } from 'vitest';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { Character } from './Character';
import { ChatMessage } from './ChatMessage';
import { Room } from './Room';
import { StoryChunk } from './StoryChunk';

describe('Basic room actions', () => {
    const fakeRepo: IRoomRepository = {
        fetchRooms: vi.fn().mockReturnValue({}),
        updateRoom: vi.fn().mockReturnValue({}),
        createRoom: vi.fn().mockReturnValue({}),
        deleteRoom: vi.fn().mockReturnValue({})
    };

    it('Changes its name', () => {
        const room: Room = new Room(fakeRepo);

        const newName = 'Random name';
        room.setName(newName);
        expect(room.getGameSettings().roomName).toEqual(newName);

        const otherName = 'Another random name';
        room.setName(otherName);
        expect(room.getGameSettings().roomName).toEqual(otherName);
    });

    it('Changes its player count', () => {
        const room: Room = new Room(fakeRepo);

        room.setMaxPlayerCount(4);
        expect(room.getGameSettings().maxPlayerCount).toEqual(4);

        room.setMaxPlayerCount(2);
        expect(room.getGameSettings().maxPlayerCount).toEqual(2);
    });

    it('Allows to add characters', () => {
        const room: Room = new Room(fakeRepo);

        expect(room.getCharacters().length).toEqual(0);

        const testCharacters: Character[] = [new Character(), new Character()];

        room.addCharacter(testCharacters[0]);
        room.addCharacter(testCharacters[1]);

        expect(room.getCharacters()).toStrictEqual(testCharacters);
    });

    it('Does not allow adding characters over the limit', () => {
        const room: Room = new Room(fakeRepo);

        room.setMaxPlayerCount(2);
        room.addCharacter(new Character());
        room.addCharacter(new Character());
        room.addCharacter(new Character());

        expect(room.getCharacters().length).toEqual(2);
    });

    it('Adds chat messages to the broadcast chat', () => {
        const room: Room = new Room(fakeRepo);

        const testMessages: ChatMessage[] = [
            new ChatMessage(randomUUID(), 'Hi!', new Date()),
            new ChatMessage(randomUUID(), 'Hello!', new Date()),
            new ChatMessage(randomUUID(), 'World!', new Date())
        ];

        room.addBrodcastMessage(testMessages[0]);
        room.addBrodcastMessage(testMessages[1]);
        room.addBrodcastMessage(testMessages[2]);

        expect(room.getBroadcast().messages).toStrictEqual(testMessages);
    });

    it('Adds story chunks to the story', () => {
        const room: Room = new Room(fakeRepo);

        const testStoryChunks: StoryChunk[] = [
            new StoryChunk(
                0,
                'some title',
                'some content',
                'some image',
                new Date()
            ),
            new StoryChunk(
                1,
                'another title',
                'another content',
                'another image',
                new Date()
            )
        ];

        room.addStoryChunk(testStoryChunks[0]);
        room.addStoryChunk(testStoryChunks[1]);

        expect(room.getBroadcast().messages).toStrictEqual(testStoryChunks);
    });

    it('Adds story chunks to the story', () => {
        const room: Room = new Room(fakeRepo);

        const testStoryChunks: StoryChunk[] = [
            new StoryChunk(
                0,
                'some title',
                'some content',
                'some image',
                new Date()
            ),
            new StoryChunk(
                1,
                'another title',
                'another content',
                'another image',
                new Date()
            )
        ];

        room.addStoryChunk(testStoryChunks[0]);
        room.addStoryChunk(testStoryChunks[1]);

        expect(room.getStoryChunks()).toStrictEqual(testStoryChunks);
    });

    it('Does not allow to store more than 3 images', () => {
        const room: Room = new Room(fakeRepo);

        const testStoryChunks: StoryChunk[] = [
            new StoryChunk(
                0,
                'some title',
                'some content',
                'some image',
                new Date()
            ),
            new StoryChunk(
                1,
                'another title',
                'another content',
                'another image',
                new Date()
            ),
            new StoryChunk(
                2,
                'again some title',
                'again some content',
                'again some image',
                new Date()
            ),
            new StoryChunk(
                3,
                'even another title',
                'even another content',
                'even another image',
                new Date()
            )
        ];

        room.addStoryChunk(testStoryChunks[0]);
        room.addStoryChunk(testStoryChunks[1]);
        room.addStoryChunk(testStoryChunks[2]);

        expect(room.getStoryChunks()[0].imageUrl).toStrictEqual('some image');

        room.addStoryChunk(testStoryChunks[3]);

        expect(room.getStoryChunks()[0].imageUrl).toBeUndefined();
    });
});
