import { ColumnType, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { config } from '@/config';

const { PG_HOST, PG_NAME, PG_PASSWORD, PG_PORT, PG_USER } = config.pick([
    'PG_HOST',
    'PG_NAME',
    'PG_PASSWORD',
    'PG_PORT',
    'PG_USER'
]);

export interface Database {
    Rooms: RoomsTable;
    StoryChunks: StoryChunksTable;
    Characters: CharactersTable;
    ChatMessages: ChatMessagesTable;
}

export interface RoomsTable {
    id: string;
    gameMasterID: string;
    roomName: string;
    maxPlayerCount: number;
}

export interface StoryChunksTable {
    roomID: string;
    chunkID: number;
    title: string;
    content: string;
    imageURL: string;
    timestamp: ColumnType<Date, string | undefined, never>;
}

export interface CharactersTable {
    id: string;
    nick: string;
    description: string;
    roomID: string;
    userID: string;
    submitContent: string | null;
    submitTimestamp: ColumnType<
        Date | null,
        string | undefined | null,
        string | undefined | null
    >;
}

export interface ChatMessagesTable {
    roomID: string;
    messageID: number;
    from: string; // Characters.ihttps://vitest.dev/guide/mocking.htmld
    to: string; // Characters.id
    content: string;
}

const dialect = new PostgresDialect({
    pool: new Pool({
        database: PG_NAME,
        host: PG_HOST,
        user: PG_USER,
        password: PG_PASSWORD,
        port: PG_PORT
    })
});

export const db = new Kysely<Database>({
    dialect
});
