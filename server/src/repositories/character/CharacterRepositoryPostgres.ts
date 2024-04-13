import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Character } from '@/domain/game/Character';
import { Database } from '@/infrastructure/postgres/db';

import { ICharacterRepository } from './ICharacterRepository';

/**
 * Postgres based implementation of {@link ICharacterRepository}
 */
export class CharacterRepositoryPostgres implements ICharacterRepository {
    constructor(db: Kysely<Database>) {
        db;
        Kysely;
    }

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
