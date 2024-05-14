import {
    ErrorCode,
    MAX_CHARACTER_DESCRIPTION_LENGTH,
    MAX_CHARACTER_NICK_LENGTH,
    QuasmComponent,
    QuasmError
} from '@quasm/common';
import { UUID } from 'crypto';

import { ICharacterRepository } from '@/repositories/character/ICharacterRepository';

export interface CharacterDetails {
    userID: string;
    nick: string;
    description?: string;
    profileIMG?: string;
}

export class Character {
    constructor(
        readonly characerRepository: ICharacterRepository,
        readonly id: UUID,
        readonly userID: string,
        private nick: string,
        readonly isGameMaster: boolean,
        public profileIMG?: string,
        private description?: string
    ) {
        this.validateNick(this.nick);
        this.validateDescription(this.description);
    }

    validateNick(nick: string) {
        if (nick.length <= 0) {
            throw new QuasmError(
                QuasmComponent.CHARACTER,
                400,
                ErrorCode.NickLengthEmpty,
                nick
            );
        }
        if (nick.length > MAX_CHARACTER_NICK_LENGTH) {
            throw new QuasmError(
                QuasmComponent.CHARACTER,
                400,
                ErrorCode.NickLengthTooLong,
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

    getNick(): string {
        return this.nick;
    }

    async setNick(newNick: string) {
        this.validateNick(newNick);

        await this.characerRepository.updateCharacter(this.id, {
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

        await this.characerRepository.updateCharacter(this.id, {
            ...this,
            description: newDescription
        });

        this.description = newDescription;
    }
}