/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { randomUUID } from 'crypto';
import { describe, expect, it, vi } from 'vitest';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { CharacterDetails } from './Character';
// import { ChatMessage } from './ChatMessage';
import { Room, RoomSettings } from './Room';
import { StoryChunk } from './StoryChunk';

describe('Basic room actions', () => {
    const fakeRepo: IRoomRepository = {
        getRoomByID: vi.fn().mockReturnValue({}),
        fetchRooms: vi.fn().mockReturnValue({}),
        updateRoom: vi.fn().mockReturnValue({}),
        createRoom: vi.fn().mockReturnValue({}),
        deleteRoom: vi.fn().mockReturnValue({}),
        addCharacter: vi.fn().mockReturnValue({}),
        updateCharacter: vi.fn().mockReturnValue({})
    };

    it('Changes its name', () => {
        const room: Room = new Room(
            fakeRepo,
            randomUUID(),
            randomUUID(),
            new RoomSettings('Name', 5),
            []
        );

        const newName = 'Random name';
        void room.setName(newName);
        expect(room.getName()).toEqual(newName);

        const otherName = 'Another random name';
        room.setName(otherName);
        expect(room.getName()).toEqual(otherName);
    });

    it('Changes its player limit', () => {
        const room: Room = new Room(
            fakeRepo,
            randomUUID(),
            randomUUID(),
            new RoomSettings('Name', 5),
            []
        );

        room.setMaxPlayerCount(4);
        expect(room.getMaxPlayerCount()).toEqual(4);

        room.setMaxPlayerCount(2);
        expect(room.getMaxPlayerCount()).toEqual(2);
    });

    it('Allows to add characters', () => {
        const room: Room = new Room(
            fakeRepo,
            randomUUID(),
            randomUUID(),
            new RoomSettings('Name', 5),
            []
        );

        expect(room.getCharacters().length).toEqual(0);

        const testCharacters: CharacterDetails[] = [
            {
                userID: randomUUID(),
                room: room,
                nick: 'Some nick',
                description: 'Some description',
                playerTurnSubmit: undefined
            },
            {
                userID: randomUUID(),
                room: room,
                nick: 'Another nick',
                description: 'Another description',
                playerTurnSubmit: undefined
            }
        ];

        room.addCharacter(testCharacters[0]);
        room.addCharacter(testCharacters[1]);

        expect(room.getCharacters()).toStrictEqual(testCharacters);
    });

    it('Does not allow adding characters over the limit', () => {
        const room: Room = new Room(
            fakeRepo,
            randomUUID(),
            randomUUID(),
            new RoomSettings('Name', 5),
            []
        );

        const testCharacters: CharacterDetails[] = [
            {
                userID: randomUUID(),
                room: room,
                nick: 'Some nick',
                description: 'Some description',
                playerTurnSubmit: undefined
            },
            {
                userID: randomUUID(),
                room: room,
                nick: 'Random nick',
                description: 'Random description',
                playerTurnSubmit: undefined
            },
            {
                userID: randomUUID(),
                room: room,
                nick: 'Another nick',
                description: 'Another description',
                playerTurnSubmit: undefined
            }
        ];

        room.setMaxPlayerCount(2);
        room.addCharacter(testCharacters[0]);
        room.addCharacter(testCharacters[1]);
        room.addCharacter(testCharacters[3]);

        expect(room.getCharacters().length).toEqual(2);
    });

    // it('Adds chat messages to the broadcast chat', () => {
    //     const room: Room = new Room(
    //         fakeRepo,
    //         randomUUID(),
    //         randomUUID(),
    //         new RoomSettings('Name', 5),
    //         []
    //     );

    //     const testMessages: ChatMessage[] = [
    //         new ChatMessage(randomUUID(), 'Hi!', new Date()),
    //         new ChatMessage(randomUUID(), 'Hello!', new Date()),
    //         new ChatMessage(randomUUID(), 'World!', new Date())
    //     ];

    //     room.addBrodcastMessage(testMessages[0]);
    //     room.addBrodcastMessage(testMessages[1]);
    //     room.addBrodcastMessage(testMessages[2]);

    //     expect(room.getBroadcast().messages).toStrictEqual(testMessages);
    // });

    // it('Adds story chunks to the story', () => {
    //     const room: Room = new Room(
    //         fakeRepo,
    //         randomUUID(),
    //         randomUUID(),
    //         new RoomSettings('Name', 5),
    //         []
    //     );

    //     const testStoryChunks: StoryChunk[] = [
    //         new StoryChunk(
    //             0,
    //             'some title',
    //             'some content',
    //             'some image',
    //             new Date()
    //         ),
    //         new StoryChunk(
    //             1,
    //             'another title',
    //             'another content',
    //             'another image',
    //             new Date()
    //         )
    //     ];

    //     room.addStoryChunk(testStoryChunks[0]);
    //     room.addStoryChunk(testStoryChunks[1]);

    //     expect(room.getBroadcast().messages).toStrictEqual(testStoryChunks);
    // });

    // it('Adds story chunks to the story', () => {
    //     const room: Room = new Room(
    //         fakeRepo,
    //         randomUUID(),
    //         randomUUID(),
    //         new RoomSettings('Name', 5),
    //         []
    //     );

    //     const testStoryChunks: StoryChunk[] = [
    //         new StoryChunk(
    //             0,
    //             'some title',
    //             'some content',
    //             'some image',
    //             new Date()
    //         ),
    //         new StoryChunk(
    //             1,
    //             'another title',
    //             'another content',
    //             'another image',
    //             new Date()
    //         )
    //     ];

    //     room.addStoryChunk(testStoryChunks[0]);
    //     room.addStoryChunk(testStoryChunks[1]);

    //     expect(room.getStoryChunks()).toStrictEqual(testStoryChunks);
    // });

    // it('Does not allow to store more than 3 images', () => {
    //     const room: Room = new Room(
    //         fakeRepo,
    //         randomUUID(),
    //         randomUUID(),
    //         new RoomSettings('Name', 5),
    //         []
    //     );

    //     const testStoryChunks: StoryChunk[] = [
    //         new StoryChunk(
    //             0,
    //             'some title',
    //             'some content',
    //             'some image',
    //             new Date()
    //         ),
    //         new StoryChunk(
    //             1,
    //             'another title',
    //             'another content',
    //             'another image',
    //             new Date()
    //         ),
    //         new StoryChunk(
    //             2,
    //             'again some title',
    //             'again some content',
    //             'again some image',
    //             new Date()
    //         ),
    //         new StoryChunk(
    //             3,
    //             'even another title',
    //             'even another content',
    //             'even another image',
    //             new Date()
    //         )
    //     ];

    //     room.addStoryChunk(testStoryChunks[0]);
    //     room.addStoryChunk(testStoryChunks[1]);
    //     room.addStoryChunk(testStoryChunks[2]);

    //     expect(room.getStoryChunks()[0].imageUrl).toStrictEqual('some image');

    //     room.addStoryChunk(testStoryChunks[3]);

    //     expect(room.getStoryChunks()[0].imageUrl).toBeUndefined();
    // });
});

describe('Story Chunk tests', () => {
    const fakeRepo: IRoomRepository = {
        getRoomByID: vi.fn().mockReturnValue({}),
        fetchRooms: vi.fn().mockReturnValue({}),
        updateRoom: vi.fn().mockReturnValue({}),
        createRoom: vi.fn().mockReturnValue({}),
        deleteRoom: vi.fn().mockReturnValue({}),
        addCharacter: vi.fn().mockReturnValue({}),
        updateCharacter: vi.fn().mockReturnValue({}),
        fetchStory: vi.fn().mockResolvedValue([]),
        addStoryChunk: vi
            .fn()
            .mockImplementation((id, chunk) => Promise.resolve(chunk))
    };

    it('Can add and fetch StoryChunks', async () => {
        const roomID = randomUUID();
        const roomSettings = new RoomSettings('Example Room', 4);
        const room = new Room(fakeRepo, roomID, roomSettings, []);

        const newChunk = new StoryChunk(
            -1,
            'Story Title',
            'Story content here',
            'exampleURL',
            new Date()
        );
        await room.addStoryChunk(newChunk);

        const range = { offset: 5, count: 10 };
        const retrievedChunks = await room.fetchStory(range);

        expect(fakeRepo.addStoryChunk).toHaveBeenCalledTimes(1);
        expect(fakeRepo.fetchStory).toHaveBeenCalledTimes(1);
        expect(retrievedChunks).toEqual([newChunk]);
    });
});
