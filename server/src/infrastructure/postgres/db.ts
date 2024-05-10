import { ColumnType, Generated, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { config } from '@/config';

const { PG_HOST, PG_NAME, PG_PASSWORD, PG_PORT, PG_USER, PG_SSL } = config.pick(
    ['PG_HOST', 'PG_NAME', 'PG_PASSWORD', 'PG_PORT', 'PG_USER', 'PG_SSL']
);

export interface Database {
    Rooms: RoomsTable;
    StoryChunks: StoryChunksTable;
    Characters: CharactersTable;
    ChatMessages: ChatMessagesTable;
}

export interface RoomsTable {
    id: string;
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
    description: string | null;
    roomID: string;
    isGameMaster: boolean;
    userID: string;
    profileIMG: string | null;
    submitContent: string | null;
    submitTimestamp: ColumnType<
        Date | null,
        string | undefined | null,
        string | undefined | null
    >;
}

export interface ChatMessagesTable {
    messageID: Generated<number>;
    from: string;
    to: string;
    content: string;
    timestamp: ColumnType<Date, string | undefined, never>;
}

const dialect = new PostgresDialect({
    pool: new Pool({
        database: PG_NAME,
        host: PG_HOST,
        user: PG_USER,
        password: PG_PASSWORD,
        port: PG_PORT,
        ssl: PG_SSL
    })
});

export const db = new Kysely<Database>({
    dialect
});
