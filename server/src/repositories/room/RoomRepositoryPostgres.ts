import { UUID, randomUUID } from 'crypto';
import { Kysely } from 'kysely';

import { Database } from '@/infrastructure/postgres/db';
import { IRoomRepository, } from './IRoomRepository';
import { Character, CharacterDetails } from '@/domain/game/Character';
import { Room, RoomDetails, RoomSettings } from '@/domain/game/Room';

export class RoomRepositoryPostgres implements IRoomRepository {
    private fetchedRooms: Map<UUID, Room>;

    constructor(private db: Kysely<Database>) {
        this.fetchedRooms = new Map();
    }

    async createRoom(roomDetails: RoomDetails): Promise<Room> {
        const room = {
            id: randomUUID(), // sliskie
            gameMasterID: roomDetails.gameMaster,
            roomName: roomDetails.roomSettings.roomName,
            maxPlayerCount: roomDetails.roomSettings.maxPlayerCount
        }

        await this.db.insertInto('Rooms')
                     .values(room)
                     .execute();

        const newRoom = new Room(
            this,
            room.id,
            roomDetails.gameMaster,
            roomDetails.roomSettings,
            []);

        this.fetchedRooms.set(room.id, newRoom);
        return newRoom;
    }

    async fetchRooms(userID: UUID): Promise<Room[]> {
        const fetchedRoomIDs = await this.db
            .selectFrom('Rooms')
            .innerJoin('Characters', 'roomID', 'roomID')
            .where('userID', '=', userID)
            .select(['roomID'])
            .execute();

        let rooms: Room[] = [];
        for (let i = 0; i < rooms.length; i++) {
            if (this.fetchedRooms.has(fetchedRoomIDs[i].roomID as UUID)) {
                rooms[i] = this.fetchedRooms.get(fetchedRoomIDs[i].roomID as UUID)!;
            } else {
                rooms[i] = await this.getRoomByID(fetchedRoomIDs[i].roomID as UUID);
            }
        }

        return rooms;
    }

    async getRoomByID(roomID: UUID): Promise<Room> {
        if (this.fetchedRooms.has(roomID)) {
            return this.fetchedRooms.get(roomID)!;
        }

        const fetchedRoom = await this.db
            .selectFrom('Rooms')
            .where('id', '=', roomID)
            .selectAll()
            .executeTakeFirst();

        const fetchedCharacters = await this.db
            .selectFrom('Characters')
            .where('roomID', '=', roomID)
            .selectAll()
            .execute();

        const roomSettings = {
            roomName: fetchedRoom!.roomName,
            maxPlayerCount: fetchedRoom!.maxPlayerCount
        }

        let characters: Character[] = [];
        const room = new Room(this, fetchedRoom!.id as UUID, fetchedRoom!.gameMasterID as UUID, roomSettings, characters);

        for (let i = 0; i < characters.length; i++) {
            characters[i] = new Character(
                this,
                fetchedCharacters[i].id as UUID,
                fetchedCharacters[i].userID as UUID,
                room,
                fetchedCharacters[i].nick,
                fetchedCharacters[i].description,
                undefined
            )
        }

        this.fetchedRooms.set(room.id, room);
        return room;
    }

    async updateRoom(roomID: UUID, roomSettings: RoomSettings): Promise<void> {
        await this.db
            .updateTable('Rooms')
            .set(roomSettings)
            .where('id', '=', roomID)
            .execute();

        let room = this.fetchedRooms.get(roomID)!;
        room.setName(roomSettings.roomName);
        room.setMaxPlayerCount(roomSettings.maxPlayerCount);
    }

    async deleteRoom(roomID: UUID): Promise<void> {
        await this.db
            .deleteFrom('Rooms')
            .where('id', '=', roomID)
            .execute();

        this.fetchedRooms.delete(roomID);
    }

    async addCharacter(characterDetails: CharacterDetails): Promise<Character> {
        const character = {
            id: randomUUID(),
            nick: characterDetails.nick,
            description: characterDetails.description,
            userID: characterDetails.userID,
            roomID: characterDetails.room.id
        }

        await this.db
            .insertInto('Characters')
            .values(character)
            .execute();

        const newCharacter = new Character(
            this,
            character.id,
            characterDetails.userID,
            characterDetails.room,
            characterDetails.nick,
            characterDetails.description,
            undefined // tu player submit
        )
            
        return newCharacter;
    }

    async updateCharacter(characterDetails: CharacterDetails): Promise<void> {
        await this.db
            .updateTable('Characters')
            .set(characterDetails)
            .where('userID', '=', characterDetails.userID)
            .where('roomID', '=', characterDetails.room.id)
            .execute();
    }
}
