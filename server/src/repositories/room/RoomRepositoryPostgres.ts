import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { randomUUID, UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Character, CharacterDetails } from '@/domain/game/character/Character';
import { Room } from '@/domain/game/room/Room';
import { RoomSettingsDetails } from '@/domain/game/room/RoomSettings';
import { logger } from '@/infrastructure/logger/Logger';
import { Database } from '@/infrastructure/postgres/db';

import { DataAccessFacade } from '../DataAccessFacade';
import { IRoomRepository } from './IRoomRepository';

export class RoomRepositoryPostgres implements IRoomRepository {
    private fetchedRooms: Map<UUID, Room>;

    constructor(
        private db: Kysely<Database>,
        private dataAccess: DataAccessFacade
    ) {
        this.fetchedRooms = new Map();
    }

    async createRoom(
        roomDetails: RoomSettingsDetails,
        gameMasterDetails: CharacterDetails
    ): Promise<Room> {
        const gameMasterUUID = randomUUID();
        const roomUUID = randomUUID();

        // Instantiate - and perform validation
        const room = new Room(this.dataAccess, roomUUID, roomDetails);
        const master = new Character(
            this.dataAccess.characterRepository,
            gameMasterUUID,
            gameMasterDetails.userID,
            gameMasterDetails.nick,
            true, // Creator is a game master by default
            gameMasterDetails.profileIMG
        );

        room.characters.restoreCharacter(master);
        room.chats.spawnChats();

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
                const room = new Room(this.dataAccess, r.roomID as UUID, {
                    roomName: r.roomName,
                    maxPlayerCount: r.maxPlayerCount
                });
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
            room?.characters.restoreCharacter(character);
            room?.chats.spawnChats();
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

        const room = new Room(this.dataAccess, roomID, {
            roomName,
            maxPlayerCount
        });
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

            room.characters.restoreCharacter(character);
            room.chats.spawnChats();
        });

        this.fetchedRooms.set(room.id, room);

        return room;
    }

    async updateRoom(
        roomID: UUID,
        roomSettings: Partial<RoomSettingsDetails>
    ): Promise<void> {
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
}
