import {
    ChunkRange,
    ErrorCode,
    QuasmComponent,
    QuasmError
} from '@quasm/common';
import { randomUUID, UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Character, CharacterDetails } from '@/domain/game/Character';
import {
    ChatMessage,
    ChatMessageDetails,
    ChatParticipants
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
        room.spawnChats();

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

            const room = this.fetchedRooms.get(r.roomID as UUID);
            room?.restoreCharacter(character);
            room?.spawnChats();
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

        if (roomData.length <= 0) {
            throw new QuasmError(
                QuasmComponent.DATABASE,
                404,
                ErrorCode.RoomNotFound,
                `Room ${roomID} has not been found`
            );
        }

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
            room.spawnChats();
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
                id: newCharacter.id,
                nick: newCharacter.getNick(),
                roomID,
                description: newCharacter.getDescription(),
                isGameMaster: false,
                userID: newCharacter.userID,
                profileIMG: newCharacter.profileIMG,
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
            .values(chatMessageDetails)
            .returning(['messageID', 'timestamp'])
            .executeTakeFirstOrThrow();

        const newChatMessage = new ChatMessage(
            result.messageID,
            chatMessageDetails.from,
            chatMessageDetails.to,
            chatMessageDetails.content,
            result.timestamp
        );

        return newChatMessage;
    }

    async fetchMessageCount(
        chatParticipants: ChatParticipants
    ): Promise<number> {
        if (chatParticipants === 'broadcast') {
            const { messageCount } = await this.db
                .selectFrom('ChatMessages')
                .where('ChatMessages.to', '=', 'broadcast')
                .select(({ fn }) =>
                    fn
                        .count<number>('ChatMessages.messageID')
                        .as('messageCount')
                )
                .executeTakeFirstOrThrow();

            return messageCount;
        }

        const [x, y] = chatParticipants;

        const { messageCount } = await this.db
            .selectFrom('ChatMessages')
            .where(eb =>
                eb.or([
                    eb('from', '=', x).and('to', '=', y),

                    eb('from', '=', y).and('to', '=', x)
                ])
            )
            .select(eb =>
                eb.fn.count<number>('ChatMessages.messageID').as('messageCount')
            )

            .executeTakeFirstOrThrow();

        return messageCount;
    }

    async fetchMessages(
        chatParticipants: ChatParticipants,
        range: ChunkRange
    ): Promise<ChatMessage[]> {
        let query = this.db.selectFrom('ChatMessages');
        if (chatParticipants === 'broadcast') {
            query = query.where('ChatMessages.to', '=', 'broadcast');
        } else {
            const [x, y] = chatParticipants;

            query = query.where(eb =>
                eb.or([
                    eb('from', '=', x).and('to', '=', y),

                    eb('from', '=', y).and('to', '=', x)
                ])
            );
        }

        if (range.offset) {
            query = query.where('ChatMessages.messageID', '<', range.offset);
        }

        return (
            await query
                .orderBy('messageID', 'desc')
                .limit(range.count)
                .selectAll()
                .execute()
        )
            .map(
                m =>
                    new ChatMessage(
                        m.messageID,
                        m.from as UUID,
                        m.to as UUID,
                        m.content,
                        m.timestamp
                    )
            )
            .toReversed();
    }
    //
    // async addStoryChunk(roomID: UUID, chunk: StoryChunk): Promise<StoryChunk> {
    //     await this.db
    //         .insertInto('StoryChunks')
    //         .values({
    //             roomID: roomID,
    //             title: chunk.title,
    //             content: chunk.content,
    //             imageURL: chunk.imageUrl
    //         })
    //         .executeTakeFirstOrThrow();
    //     return chunk;
    // }
    //
    // async fetchStory(roomID: UUID, range: ChunkRange): Promise<StoryChunk[]> {
    //     if (typeof range.offset == 'undefined')
    //         range.offset = DEFAULT_FETCHED_STORYCHUNKS;
    //
    //     const lowerBound = range.offset - range.count + 1;
    //     const upperBound = range.offset;
    //
    //     const storyChunkData = await this.db
    //         .selectFrom('StoryChunks')
    //         .where('roomID', '=', roomID)
    //         .where('id', '>=', lowerBound)
    //         .where('id', '<=', upperBound)
    //         .selectAll()
    //         .execute();
    //
    //     storyChunkData.forEach(r => {
    //         this.fetchedRooms.delete(r.chunkID as unknown as UUID);
    //     });
    //
    //     const result: StoryChunk[] = [];
    //
    //     storyChunkData.forEach(r => {
    //         if (!this.fetchedRooms.has(r.chunkID as unknown as UUID)) {
    //             const chunk = new StoryChunk(
    //                 r.chunkID,
    //                 r.title,
    //                 r.content,
    //                 r.imageURL,
    //                 r.timestamp
    //             );
    //             this.fetchedStoryChunks.set(
    //                 r.chunkID as unknown as UUID,
    //                 chunk
    //             );
    //             result.push(chunk);
    //         }
    //     });
    //     return result;
    // }
    //
    // fetchStoryChunks(
    //     roomID: string,
    //     range: ChunkRange
    // ): Promise<StoryChunk[]> {}
}
