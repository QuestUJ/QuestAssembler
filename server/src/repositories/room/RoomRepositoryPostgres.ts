import { randomUUID, UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Character, CharacterDetails } from '@/domain/game/Character';
import { ChatMessage, ChatMessageDetails, Chatter } from '@/domain/game/ChatMessage';
import { Chat, Range } from '@/domain/game/Chat';
import { Room, RoomSettings } from '@/domain/game/Room';
import { Database } from '@/infrastructure/postgres/db';

import { IRoomRepository } from './IRoomRepository';

export class RoomRepositoryPostgres implements IRoomRepository {
    private fetchedRooms: Map<UUID, Room>;

    constructor(private db: Kysely<Database>) {
        this.fetchedRooms = new Map();
    }

    async createRoom(
        roomDetails: RoomSettings,
        gameMasterDetails: CharacterDetails
    ): Promise<Room> {
        const gameMasterUUID = randomUUID();
        const roomUUID = randomUUID();
        await this.db.transaction().execute(async trx => {
            await trx
                .insertInto('Rooms')
                .values({
                    id: roomUUID,
                    gameMasterID: gameMasterUUID,
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
                    roomID: roomUUID,
                    userID: gameMasterDetails.userID
                })
                .executeTakeFirstOrThrow();
        });

        const room = new Room(this, roomUUID, roomDetails);
        const master = new Character(
            this,
            gameMasterUUID,
            gameMasterDetails.userID,
            gameMasterDetails.nick,
            gameMasterDetails.description,
            true
        );

        room.restoreCharacter(master);

        this.fetchedRooms.set(room.id, room);
        return room;
    }

    async fetchRooms(userID: string): Promise<Room[]> {
        const roomsData = await this.db
            .selectFrom('Rooms')
            .innerJoin('Characters', 'Rooms.id', 'Characters.roomID')
            .where('Characters.userID', '=', userID)
            .selectAll()
            .execute();

        const result: Room[] = [];

        roomsData.forEach(r => {
            if (!this.fetchedRooms.has(r.id as UUID)) {
                const settings = new RoomSettings(r.roomName, r.maxPlayerCount);
                const room = new Room(this, r.id as UUID, settings);
                this.fetchedRooms.set(r.id as UUID, room);
                result.push(room);
            }

            const character = new Character(
                this,
                r.id as UUID,
                r.userID,
                r.nick,
                r.description,
                r.gameMasterID === r.id
            );
            this.fetchedRooms.get(r.id as UUID)?.restoreCharacter(character);
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
                r.description,
                r.gameMasterID === r.id
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
            characterDetails.description,
            false
        );

        console.log(roomID);

        await this.db
            .insertInto('Characters')
            .values({
                id: randomUUID(),
                nick: characterDetails.nick,
                roomID,
                description: characterDetails.description,
                userID: characterDetails.userID,
                submitContent: null,
                submitTimestamp: null
            })
            .executeTakeFirstOrThrow();

        return newCharacter;
    }

    async updateCharacter(
        id: UUID,
        characterDetails: CharacterDetails
    ): Promise<void> {
        await this.db
            .updateTable('Characters')
            .set(characterDetails)
            .where('id', '=', id)
            .execute();
    }

    async addMessage(chatMessageDetails: ChatMessageDetails): Promise<ChatMessage> {
        const result = await this.db
            .insertInto('ChatMessages')
            .values({
                from: chatMessageDetails.from,
                to: chatMessageDetails.to,
                content: chatMessageDetails.content,
            })
            .returning(['id', 'timestamp'])
            .executeTakeFirstOrThrow();

        const newChatMessage = new ChatMessage(
            result.id,
            chatMessageDetails.from,
            chatMessageDetails.to,
            chatMessageDetails.content,
            result.timestamp
        )

        return newChatMessage;
    }

    async fetchMessages(from: UUID, to: Chatter, range: Range): Promise<ChatMessage[]> {
        const fetchedChatMessages = await this.db
            .selectFrom('ChatMessages')
            .where('from', '=', from)
            .where('to', '=', to)
            .where('id', '<=', range.offset!)
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
            )

            chatMessages.push(chatMessage);
        })

        return chatMessages;
    }
}
