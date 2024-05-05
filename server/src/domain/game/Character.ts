import {
    ErrorCode,
    MAX_CHARACTER_DESCRIPTION_LENGTH,
    MAX_CHARACTER_NICK_LENGTH,
    QuasmComponent,
    QuasmError
} from '@quasm/common';
import { UUID } from 'crypto';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import { PlayerTurnSubmit } from './PlayerTurnSubmit';

const MAX_PLAYER_SUBMIT_LENGTH = 280;
export interface CharacterDetails {
    userID: string;
    nick: string;
    description?: string;
    playerTurnSubmit?: string;
}

export class Character {
    constructor(
        readonly roomRepository: IRoomRepository,
        readonly id: UUID,
        readonly userID: string,
        private nick: string,
        readonly isGameMaster: boolean,
        private description?: string,
        private playerTurnSubmit?: PlayerTurnSubmit
    ) {
        this.validateNick(this.nick);
        this.validateDescription(this.description);
    }

    validateNick(nick: string) {
        if (nick.length <= 0 || nick.length > MAX_CHARACTER_NICK_LENGTH) {
            throw new QuasmError(
                QuasmComponent.CHARACTER,
                400,
                ErrorCode.NickLength,
                nick
            );
        }
    }

    validateDescription(description: string | undefined) {
        if (!description) return;

        if (description.length > MAX_CHARACTER_DESCRIPTION_LENGTH) {
            throw new QuasmError(
                QuasmComponent.CHARACTER,
                400,
                ErrorCode.DescriptionLength,
                `Description length: ${description.length}`
            );
        }
    }

    getUserID(): string {
        return this.userID;
    }

    getNick(): string {
        return this.nick;
    }

    async setNick(newNick: string) {
        this.validateNick(newNick);

        await this.roomRepository.updateCharacter(this.id, {
            ...this,
            nick: newNick
        });
        this.nick = newNick;
    }

    getDescription(): string | undefined {
        return this.description;
    }

    async setDescription(newDescription: string) {
        this.validateDescription(newDescription);

        await this.roomRepository.updateCharacter(this.id, {
            ...this,
            description: newDescription
        });

        this.description = newDescription;
    }

    getPlayerTurnSubmit(): PlayerTurnSubmit | undefined {
        return this.playerTurnSubmit;
    }

    async setPlayerTurnSubmit(submit: string | undefined) {
        if (submit && submit.length > MAX_PLAYER_SUBMIT_LENGTH) {
            throw new QuasmError(
                QuasmComponent.CHARACTER,
                400,
                ErrorCode.MaxRoomName, //change this to a new error code
                'Exceeded PlayerTurnSubmit max length'
            );
        }

        return this.roomRepository.updateCharacter(this.id, {
            playerTurnSubmit: submit
        });
    }
}
