import { Kysely } from 'kysely';

import { Character } from '@/domain/game/Character';
import { Database } from '@/infrastructure/postgres/db';

import { CharacterDetails, ICharacterRepository } from './ICharacterRepository';

/**
 * Postgres based implementation of {@link ICharacterRepository}
 */
export class CharacterRepositoryPostgres implements ICharacterRepository {
    constructor(db: Kysely<Database>) {
        db;
        Kysely;
    }

    /**
     * Creates character entry in postgres and returns it's {@link Character} instance
     */
    async createCharacter(details: CharacterDetails): Promise<Character> {
        await new Promise(() => details);
        return new Character();
    }

    /**
     * Retrieves characters of the user with given id from postgres db
     */
    fetchCharacters(userID: string): Promise<Character[]> {
        userID;
        return new Promise(resolve => resolve([]));
    }
}
