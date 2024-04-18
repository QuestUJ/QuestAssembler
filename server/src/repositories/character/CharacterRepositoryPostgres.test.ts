import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { type Kysely } from 'kysely';
import * as path from 'path';
import { newDb } from 'pg-mem';
import { afterEach, describe, expect, it } from 'vitest';

import { Database } from '@/infrastructure/postgres/db';
import { CharacterRepositoryPostgres } from '@/repositories/character/CharacterRepositoryPostgres';

describe('Basic character CRUD operations', () => {
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

    it('Can store and persist character details', async () => {
        const repo = new CharacterRepositoryPostgres(db);
        const nick = 'MySimpleNick123#!@{},,``';
        const room = randomUUID();

        // store simple character
        const character = await repo.createCharacter({
            nick,
            room
        });

        // Create second instance to check if data persists
        const repo2 = new CharacterRepositoryPostgres(db);

        const results = await repo2.fetchCharacters(character.getUserID());

        expect(results.length).toEqual(1);
        expect(results[0]).toEqual(character);
    });
});
