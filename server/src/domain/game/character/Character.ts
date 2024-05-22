import {
    ErrorCode,
    MAX_CHARACTER_DESCRIPTION_LENGTH,
    MAX_CHARACTER_NICK_LENGTH,
    QuasmComponent,
    QuasmError
} from '@quasm/common';
import { UUID } from 'crypto';

import { ICharacterRepository } from '@/repositories/character/ICharacterRepository';

import { PlayerTurnSubmit } from '../story/PlayerTurnSubmit';

export interface CharacterDetails {
    userID: string;
    nick: string;
    description?: string;
    profileIMG?: string;
}

export class Character {
    private turnSubmit: PlayerTurnSubmit | null;

    constructor(
        readonly characterRepository: ICharacterRepository,
        readonly id: UUID,
        readonly userID: string,
        private nick: string,
        readonly isGameMaster: boolean,
        public profileIMG?: string,
        private description?: string,
        turnSubmit?: PlayerTurnSubmit
    ) {
        this.validateNick(this.nick);
        this.validateDescription(this.description);
        this.turnSubmit = turnSubmit ? turnSubmit : null;
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

        await this.characterRepository.updateCharacter(this.id, {
            nick: newNick
        });
        this.nick = newNick;
    }

    getDescription(): string | undefined {
        return this.description;
    }

    async setDescription(newDescription: string) {
        this.validateDescription(newDescription);

        await this.characterRepository.updateCharacter(this.id, {
            description: newDescription
        });

        this.description = newDescription;
    }

    /**
     * Watch out when using this. If you delete a character by Character.delete() characters array in CharactersComponent will become out of sync with reality
     * You will probably always want to use the room.characters.deleteCharacter()
     */
    async delete(): Promise<void> {
        await this.characterRepository.deleteCharacter(this.id);
    }

    async setTurnSubmit(content: string) {
        if (this.isGameMaster) {
            throw new QuasmError(
                QuasmComponent.CHARACTER,
                400,
                ErrorCode.MasterAction,
                `${this.id} tried to submit action`
            );
        }

        this.turnSubmit = await this.characterRepository.setTurnSubmit(
            this.id,
            content
        );

        return this.turnSubmit;
    }

    getTurnSubmit() {
        return this.turnSubmit;
    }
}
