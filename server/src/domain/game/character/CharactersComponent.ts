import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { UUID } from 'crypto';

import { ICharacterRepository } from '@/repositories/character/ICharacterRepository';

import { RoomSettings } from '../room/RoomSettings';
import { Character, CharacterDetails } from './Character';

export class CharactersComponent {
    private characters: Character[] = [];
    private characterJoinHandler?: (character: Character) => void;
    private characterLeaveHandler?: (character: Character) => void;

    constructor(
        private characterRepository: ICharacterRepository,
        private roomID: UUID,
        private settings: RoomSettings
    ) {}

    onCharacterJoin(handler: (character: Character) => void) {
        this.characterJoinHandler = handler;
    }

    onCharacterLeave(handler: (character: Character) => void) {
        this.characterLeaveHandler = handler;
    }

    validateCharacter(character: CharacterDetails) {
        if (this.characters.length >= this.settings.getMaxPlayerCount()) {
            throw new QuasmError(
                QuasmComponent.CHARACTER,
                500,
                ErrorCode.MaxPlayersExceeded,
                'Too many characters restored'
            );
        }

        if (this.characters.find(({ userID }) => userID === character.userID)) {
            throw new QuasmError(
                QuasmComponent.CHARACTER,
                400,
                ErrorCode.UserExists,
                `Room: ${this.roomID} User: ${character.userID}`
            );
        }
    }

    /**
     * Helper method for reassigning character to the Room, for adding new character to the room use {@link addCharacter}
     */
    restoreCharacter(character: Character) {
        if (this.characters.length >= this.settings.getMaxPlayerCount()) {
            throw new QuasmError(
                QuasmComponent.CHARACTER,
                500,
                ErrorCode.MaxPlayersExceeded,
                'Too many characters restored'
            );
        }

        this.characters.push(character);
    }

    hasUser(userId: string): boolean {
        return !!this.characters.find(character => character.userID === userId);
    }

    getCharacters(): Character[] {
        return this.characters;
    }

    getCharacterByUserID(userID: string): Character {
        const character = this.characters.find(ch => ch.userID === userID);
        if (!character) {
            throw new QuasmError(
                QuasmComponent.CHARACTER,
                404,
                ErrorCode.CharacterNotFound,
                `looked for userID: ${userID}`
            );
        }

        return character;
    }

    getCharacterByID(id: UUID): Character {
        const character = this.characters.find(ch => ch.id === id);
        if (!character) {
            throw new QuasmError(
                QuasmComponent.CHARACTER,
                404,
                ErrorCode.CharacterNotFound,
                id
            );
        }

        return character;
    }

    getGameMaster(): Character {
        return this.characters.find(ch => ch.isGameMaster)!;
    }

    async addCharacter(characterDetails: CharacterDetails) {
        this.validateCharacter(characterDetails);

        const character = await this.characterRepository.addCharacter(
            this.roomID,
            characterDetails
        );

        this.characters.push(character);

        if (this.characterJoinHandler) {
            this.characterJoinHandler(character);
        }

        return character;
    }

    hasEmptySlot(): boolean {
        return this.characters.length < this.settings.getMaxPlayerCount();
    }

    async deleteCharacter(id: UUID): Promise<void> {
        const characterIndex = this.characters.findIndex(
            character => character.id == id
        );
        if (characterIndex == -1) {
            throw new QuasmError(
                QuasmComponent.CHARACTER,
                404,
                ErrorCode.CharacterNotFound,
                `Character with id ${id} was not found when someone tried to delete it`
            );
        }
        const characterToBeDeleted = this.characters[characterIndex];
        if (this.characterLeaveHandler) {
            this.characterLeaveHandler(characterToBeDeleted);
        }
        this.characters.splice(characterIndex, 1);
        await characterToBeDeleted.delete();
    }
}
