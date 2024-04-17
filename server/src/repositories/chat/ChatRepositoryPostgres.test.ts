import test from 'node:test';

import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { type Kysely } from 'kysely';
import * as path from 'path';
import { newDb } from 'pg-mem';
import { afterEach, describe, expect, it } from 'vitest';

import { Database } from '@/infrastructure/postgres/db';
import { ChatRepositoryPostgres } from '@/repositories/chat/ChatRepositoryPostgres';

describe('Basic chat CRUD operations', () => {
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

    it('Can store and persist message details', async () => {
        const repo = new ChatRepositoryPostgres(db);
        const context = 'u bad';

        // Store simple message
        const message = await repo.createMessage(context);

        // Create second instance to check if data persists
        const repo2 = new ChatRepositoryPostgres(db);

        const chatID = randomUUID();
        const results = await repo2.fetchMessages(chatID);

        expect(results.length).toEqual(1);
        expect(results[0]).toEqual(message);
    });
});
