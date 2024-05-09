import {
    ChunkRange,
    DEFAULT_FETCHED_STORYCHUNKS,
    QuasmComponent
} from '@quasm/common';
import { randomUUID, UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Character, CharacterDetails } from '@/domain/game/Character';
import {
    ChatMessage,
    ChatMessageDetails,
    Chatter
} from '@/domain/game/ChatMessage';
import { PlayerTurnSubmit } from '@/domain/game/PlayerTurnSubmit';
import { Room, RoomSettings } from '@/domain/game/Room';
import { StoryChunk } from '@/domain/game/StoryChunk';
import { logger } from '@/infrastructure/logger/Logger';
import { Database } from '@/infrastructure/postgres/db';

import { IRoomRepository } from './IRoomRepository';

/**
 * Main repository providing access to PostgreSQL based database
 */
export class RoomRepositoryPostgres implements IRoomRepository {
    private fetchedRooms: Map<UUID, Room>;
    private fetchedStoryChunks: Map<UUID, StoryChunk>;

    constructor(private db: Kysely<Database>) {
        this.fetchedRooms = new Map();
        this.fetchedStoryChunks = new Map();
    }

    async createRoom(
        roomDetails: RoomSettings,
        gameMasterDetails: CharacterDetails
    ): Promise<Room> {
        const gameMasterUUID = randomUUID();
        const roomUUID = randomUUID();

        logger.info(
            QuasmComponent.DATABASE,
            `Creating Room ${roomUUID} instance and validating`
        );

        // Instantiate - and perform validation
        const room = new Room(this, roomUUID, roomDetails);
        const master = new Character(
            this,
            gameMasterUUID,
            gameMasterDetails.userID,
            gameMasterDetails.nick,
            true, // Creator is a game master by default
            gameMasterDetails.profileIMG
        );

        room.restoreCharacter(master);

        logger.info(
            QuasmComponent.DATABASE,
            `Room ${roomUUID} validation passed, persisting in database`
        );
        await this.db.transaction().execute(async trx => {
            await trx
                .insertInto('Rooms')
                .values({
                    id: roomUUID,
                    roomName: roomDetails.roomName,
                    maxPlayerCount: roomDetails.maxPlayerCount
                })
                .executeTakeFirstOrThrow();

            await trx
                .insertInto('Characters')
                .values({
                    id: gameMasterUUID,
                    nick: gameMasterDetails.nick,
                    description: gameMasterDetails.description,
                    isGameMaster: true,
                    roomID: roomUUID,
                    userID: gameMasterDetails.userID,
                    profileIMG: gameMasterDetails.profileIMG
                })
                .executeTakeFirstOrThrow();
        });

        this.fetchedRooms.set(room.id, room);
        return room;
    }

    async fetchRooms(userID: string): Promise<Room[]> {
        const roomsData = await this.db
            .selectFrom('Rooms')
            .innerJoin(
                eb =>
                    eb
                        .selectFrom('Characters')
                        .select('Characters.roomID')
                        .where('Characters.userID', '=', userID)
                        .as('userCharacter'),
                join => join.onRef('userCharacter.roomID', '=', 'Rooms.id')
            )
            .innerJoin('Characters', 'Characters.roomID', 'Rooms.id')
            .select([
                'Rooms.roomName',
                'Rooms.maxPlayerCount',
                'Rooms.id as roomID',
                'Characters.id as characterID',
                'Characters.userID',
                'Characters.nick',
                'Characters.isGameMaster',
                'Characters.description',
                'Characters.profileIMG'
            ])
            .execute();

        roomsData.forEach(r => {
            this.fetchedRooms.delete(r.roomID as UUID);
        });

        const result: Room[] = [];

        roomsData.forEach(r => {
            if (!this.fetchedRooms.has(r.roomID as UUID)) {
                const settings = new RoomSettings(r.roomName, r.maxPlayerCount);
                const room = new Room(this, r.roomID as UUID, settings);
                this.fetchedRooms.set(r.roomID as UUID, room);
                result.push(room);
            }

            const character = new Character(
                this,
                r.characterID as UUID,
                r.userID,
                r.nick,
                r.isGameMaster,
                r.profileIMG ?? undefined,
                r.description ?? undefined
            );
            this.fetchedRooms
                .get(r.roomID as UUID)
                ?.restoreCharacter(character);
        });

        return result;
    }

    async getRoomByID(roomID: UUID): Promise<Room> {
        if (this.fetchedRooms.has(roomID)) {
            return this.fetchedRooms.get(roomID)!;
        }

        const roomData = await this.db
            .selectFrom('Rooms')
            .innerJoin('Characters', 'Rooms.id', 'Characters.roomID')
            .where('Rooms.id', '=', roomID)
            .selectAll()
            .execute();

        const { roomName, maxPlayerCount } = roomData[0];

        const settings = new RoomSettings(roomName, maxPlayerCount);
        const room = new Room(this, roomID, settings);
        roomData.forEach(r => {
            const character = new Character(
                this,
                r.id as UUID,
                r.userID,
                r.nick,
                r.isGameMaster,
                r.profileIMG ?? undefined,
                r.description ?? undefined
            );

            room.restoreCharacter(character);
        });

        this.fetchedRooms.set(room.id, room);

        return room;
    }

    async updateRoom(roomID: UUID, roomSettings: RoomSettings): Promise<void> {
        await this.db
            .updateTable('Rooms')
            .set(roomSettings)
            .where('id', '=', roomID)
            .execute();
    }

    async deleteRoom(roomID: UUID): Promise<void> {
        await this.db.deleteFrom('Rooms').where('id', '=', roomID).execute();

        this.fetchedRooms.delete(roomID);
    }

    async addCharacter(
        roomID: UUID,
        characterDetails: CharacterDetails
    ): Promise<Character> {
        const newCharacter = new Character(
            this,
            randomUUID(),
            characterDetails.userID,
            characterDetails.nick,
            false,
            characterDetails.profileIMG,
            characterDetails.description
        );

        await this.db
            .insertInto('Characters')
            .values({
                id: randomUUID(),
                nick: characterDetails.nick,
                roomID,
                description: characterDetails.description,
                isGameMaster: false,
                userID: characterDetails.userID,
                profileIMG: characterDetails.profileIMG,
                submitContent: null,
                submitTimestamp: null
            })
            .executeTakeFirstOrThrow();

        return newCharacter;
    }

    async updateCharacter(
        id: UUID,
        characterDetails: Partial<CharacterDetails>
    ): Promise<void> {
        await this.db
            .updateTable('Characters')
            .set(characterDetails)
            .where('id', '=', id)
            .execute();
    }

    async setPlayerTurnSubmit(
        id: UUID,
        submit: PlayerTurnSubmit
    ): Promise<void> {
        await this.db
            .updateTable('Characters')
            .set(submit)
            .where('id', '=', id)
            .execute();
    }

    async addMessage(
        chatMessageDetails: ChatMessageDetails
    ): Promise<ChatMessage> {
        const result = await this.db
            .insertInto('ChatMessages')
            .values({
                from: chatMessageDetails.from,
                to: chatMessageDetails.to,
                content: chatMessageDetails.content
            })
            .returning(['id', 'timestamp'])
            .executeTakeFirstOrThrow();

        const newChatMessage = new ChatMessage(
            result.id,
            chatMessageDetails.from,
            chatMessageDetails.to,
            chatMessageDetails.content,
            result.timestamp
        );

        return newChatMessage;
    }

    async fetchMessages(
        from: UUID,
        to: Chatter,
        range: ChunkRange
    ): Promise<ChatMessage[]> {
        const fetchedChatMessages = await this.db
            .selectFrom('ChatMessages')
            .where('from', '=', from)
            .where('to', '=', to)
            .where('id', '<=', range.offset)
            .selectAll()
            .orderBy('id', 'desc')
            .limit(range.count)
            .execute();

        const chatMessages: ChatMessage[] = [];
        fetchedChatMessages.forEach(m => {
            const chatMessage = new ChatMessage(
                m.id,
                m.from as UUID,
                m.to as Chatter,
                m.content,
                m.timestamp
            );

            chatMessages.push(chatMessage);
        });

        return chatMessages;
    }
    async addStoryChunk(roomID: UUID, chunk: StoryChunk): Promise<StoryChunk> {
        await this.db
            .insertInto('StoryChunks')
            .values({
                roomID: roomID,
                title: chunk.title,
                content: chunk.content,
                imageURL: chunk.imageUrl
            })
            .executeTakeFirstOrThrow();
        return chunk;
    }

    async fetchStory(roomID: UUID, range: ChunkRange): Promise<StoryChunk[]> {
        if (typeof range.offset == 'undefined')
            range.offset = DEFAULT_FETCHED_STORYCHUNKS;

        const lowerBound = range.offset - range.count + 1;
        const upperBound = range.offset;

        const storyChunkData = await this.db
            .selectFrom('StoryChunks')
            .where('roomID', '=', roomID)
            .where('id', '>=', lowerBound)
            .where('id', '<=', upperBound)
            .selectAll()
            .execute();

        storyChunkData.forEach(r => {
            this.fetchedRooms.delete(r.chunkID as unknown as UUID);
        });

        const result: StoryChunk[] = [];

        storyChunkData.forEach(r => {
            if (!this.fetchedRooms.has(r.chunkID as unknown as UUID)) {
                const chunk = new StoryChunk(
                    r.chunkID,
                    r.title,
                    r.content,
                    r.imageURL,
                    r.timestamp
                );
                this.fetchedStoryChunks.set(
                    r.chunkID as unknown as UUID,
                    chunk
                );
                result.push(chunk);
            }
        });
        return result;
    }
}
