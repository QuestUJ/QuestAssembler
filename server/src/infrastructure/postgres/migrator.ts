import { promises as fs } from 'fs';
import { FileMigrationProvider, Migrator } from 'kysely';
import { run } from 'kysely-migration-cli';
import * as path from 'path';

import { db } from './db';

const migrationFolder = path.join(__dirname, 'migrations');

const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder
    })
});

run(db, migrator, migrationFolder);
