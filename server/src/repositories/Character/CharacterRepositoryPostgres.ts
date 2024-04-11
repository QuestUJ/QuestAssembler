import { UUID } from 'crypto';

import { Character } from '@/domain/game/Character';

import { ICharacterRepository } from './ICharacterRepository';

/**
 * Postgres implementation of {@link ICharacterRepository}
 */
export class CharacterRepositoryPostgres implements ICharacterRepository {
    /**
     * creates character entry in postgres and returns it's {@link Character} instance
     */
    createCharacter(): Character {
        return new Character();
    }

    /**
     * retrieves characters of the user with given id
     */
    fetchCharacters(userID: UUID): Character[] {
        userID;
        return [];
    }
}
