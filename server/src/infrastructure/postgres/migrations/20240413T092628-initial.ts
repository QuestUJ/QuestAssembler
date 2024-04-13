import { type Kysely, sql } from 'kysely';

import { Database } from '../db';

export async function up(db: Kysely<Database>): Promise<void> {
    await db.schema
        .createTable('Rooms')
        .addColumn('id', 'varchar(36)', col => col.primaryKey())
        .addColumn('gameMasterID', 'varchar(36)', col => col.notNull())
        .addColumn('roomName', 'varchar(256)', col => col.notNull())
        .addColumn('maxPlayerCount', 'integer', col => col.notNull())
        .execute();

    await db.schema
        .createTable('StoryChunks')
        .addColumn('chunkID', 'serial', col => col.primaryKey())
        .addColumn('roomID', 'varchar(36)', col =>
            col
                .notNull()
                .references('Rooms.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('title', 'varchar(256)', col => col.notNull())
        .addColumn('content', 'varchar', col => col.notNull())
        .addColumn('imageURL', 'varchar')
        .addColumn('timestamp', 'timestamp', col =>
            col.notNull().defaultTo(sql`NOW()`)
        )
        .execute();

    await db.schema
        .createTable('Characters')
        .addColumn('id', 'varchar(36)', col => col.primaryKey())
        .addColumn('nick', 'varchar(256)', col => col.notNull())
        .addColumn('description', 'varchar')
        .addColumn('roomID', 'varchar(36)', col =>
            col
                .notNull()
                .references('Rooms.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('userID', 'varchar(36)', col => col.notNull())
        .addColumn('submitContent', 'varchar')
        .addColumn('submitTimestamp', 'timestamp', col =>
            col.notNull().defaultTo(sql`NOW()`)
        )
        .execute();

    await db.schema
        .createTable('ChatMessages')
        .addColumn('messageID', 'serial', col => col.primaryKey())
        .addColumn('from', 'varchar(36)', col =>
            col.notNull().references('Characters.id')
        )
        .addColumn('to', 'varchar(36)', col =>
            col.notNull().references('Characters.id')
        )
        .addColumn('content', 'varchar', col => col.notNull())
        .addColumn('timestamp', 'timestamp', col =>
            col.notNull().defaultTo(sql`NOW()`)
        )
        .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
    await db.schema.dropTable('ChatMessages').execute();
    await db.schema.dropTable('Characters').execute();
    await db.schema.dropTable('StoryChunks').execute();
    await db.schema.dropTable('Rooms').execute();
}
