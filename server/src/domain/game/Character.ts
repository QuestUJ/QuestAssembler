import { UUID } from 'crypto';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { PlayerTurnSubmit } from './PlayerTurnSubmit';
import { Room } from './Room';
import { User } from './User';

const MAX_CHARACTER_NICK_LENGTH = 64;
const MAX_CHARACTER_DESCRIPTION_LENGTH = 256;

export interface CharacterDetails {
    readonly userID: UUID;
    readonly room: Room;
    readonly nick: string;
    readonly description: string;
    readonly playerTurnSubmit: PlayerTurnSubmit | undefined;
}

export class Character {
    constructor(
        readonly roomRepository: IRoomRepository,
        readonly id: UUID,
        readonly userID: UUID,
        readonly user: User | undefined,
        readonly room: Room,
        private nick: string,
        private description: string,
        private playerTurnSubmit: PlayerTurnSubmit | undefined
    ) {
        this.roomRepository = roomRepository;
        this.id = id;
        this.user = user;
        this.room = room;
        this.nick = nick;
        this.description = description;
        this.playerTurnSubmit = playerTurnSubmit;
    }

    getUserID(): UUID | undefined {
        return this.user?.id;
    }

    isGameMaster(): boolean {
        return this.id === this.room.gameMaster;
    }

    getNick(): string {
        return this.nick;
    }

    setNick(newNick: string) {
        if (newNick.length <= MAX_CHARACTER_NICK_LENGTH) {
            this.roomRepository.updateCharacter({ ...this, nick: newNick });
            this.nick = newNick;
        }
    }

    getDescription(): string {
        return this.description;
    }

    setDescription(newDescription: string) {
        if (newDescription.length <= MAX_CHARACTER_DESCRIPTION_LENGTH) {
            this.roomRepository.updateCharacter({
                ...this,
                description: newDescription
            });

            this.description = newDescription;
        }
    }

    getPlayerTurnSubmit(): PlayerTurnSubmit | undefined {
        return this.playerTurnSubmit;
    }

    setPlayerTurnSubmit(submit: PlayerTurnSubmit | undefined) {
        this.roomRepository.updateCharacter({
            ...this,
            playerTurnSubmit: submit
        });

        this.playerTurnSubmit = submit;
    }
}
