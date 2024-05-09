import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { type Kysely } from 'kysely';
import * as path from 'path';
import { newDb } from 'pg-mem';
import { afterEach, describe, expect, it } from 'vitest';

import { PlayerTurnSubmit } from '@/domain/game/PlayerTurnSubmit';
import { StoryChunk } from '@/domain/game/StoryChunk';
import { Database } from '@/infrastructure/postgres/db';
import { RoomRepositoryPostgres } from '@/repositories/room/RoomRepositoryPostgres';

describe('Basic room CRUD operations', () => {
    const pgMem = newDb();
    const db = pgMem.adapters.createKysely() as Kysely<Database>;

    pgMem.public.none(
        readFileSync(
            path.join(__dirname, '..', '..', 'sql_dumps', 'dump-quasm.sql'),
            'utf8'
        )
    );

    const backup = pgMem.backup();

    afterEach(() => {
        backup.restore();
    });

    it('Can store and persist room details', async () => {
        const repo = new RoomRepositoryPostgres(db);
        const gameMaster = randomUUID();

        // Store simple room
        const room = await repo.createRoom({
            gameMaster
        });

        // Create second instance to check if data persists
        const repo2 = new RoomRepositoryPostgres(db);

        const userID = randomUUID();
        const results = await repo2.fetchRooms(userID);

        expect(results.length).toEqual(1);
        expect(results[0]).toEqual(room);
    });

    it('Can update room details', async () => {
        const repo = new RoomRepositoryPostgres(db);
        const roomID = randomUUID();
        const roomDetails = {
            gameMaster: randomUUID()
        };

        repo.updateRoom(roomID, roomDetails);

        const userID = randomUUID();
        const results = await repo.fetchRooms(userID);

        expect(results[0].gameMaster).toEqual(roomDetails.gameMaster);
    });

    it('Can delete room details', async () => {
        const repo = new RoomRepositoryPostgres(db);
        const roomID = randomUUID();

        repo.deleteRoom(roomID);

        const userID = randomUUID();
        const results = await repo.fetchRooms(userID);

        expect(results.length).toEqual(0);
    });

    it('Can set and retrieve PlayerTurnSubmit', async () => {
        const repo = new RoomRepositoryPostgres(db);
        const roomID = randomUUID();
        const newSubmit = new PlayerTurnSubmit('trololo');

        const room = await repo.getRoomByID(roomID);
        const characters = room.getCharacters();
        const originalCharacter = characters[0];

        repo.setPlayerTurnSubmit(originalCharacter.id, newSubmit);

        const updatedRoom = await repo.getRoomByID(roomID);
        const updatedCharacters = updatedRoom.getCharacters();
        const updatedCharacter = updatedCharacters.find(
            char => char.userID === originalCharacter.userID
        );

        expect(updatedCharacter?.getPlayerTurnSubmit()).toEqual(newSubmit);
    });

    it('Can add and retireve Story Chunks', async () => {
        const repo = new RoomRepositoryPostgres(db);
        const roomID = randomUUID();

        const newChunk = new StoryChunk('Extremely Exciting Story');

        const chunkRange = {
            offset: 6,
            count: 2
        };
        await repo.addStoryChunk(roomID, newChunk);

        const retrievedChunks = await repo.fetchStory(roomID, chunkRange);

        expect(retrievedChunks.length).toBeGreaterThan(0);
        expect(retrievedChunks[0].title).toEqual(newChunk.title);
    });
});
