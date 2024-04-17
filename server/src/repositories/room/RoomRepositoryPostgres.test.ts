import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { type Kysely } from 'kysely';
import * as path from 'path';
import { newDb } from 'pg-mem';
import { afterEach, describe, expect, it } from 'vitest';

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
});
