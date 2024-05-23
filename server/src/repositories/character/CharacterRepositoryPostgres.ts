import { randomUUID, UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Character, CharacterDetails } from '@/domain/game/character/Character';
import { Database } from '@/infrastructure/postgres/db';

import { ICharacterRepository } from './ICharacterRepository';

export class CharacterRepositoryPostgres implements ICharacterRepository {
    constructor(private db: Kysely<Database>) {}

    async updateCharacter(
        id: UUID,
        characterDetails: Partial<CharacterDetails>
    ): Promise<void> {
        await this.db
            .updateTable('Characters')
            .set(characterDetails)
            .where('id', '=', id)
            .execute();
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
            false,
            characterDetails.profileIMG,
            characterDetails.description
        );

        await this.db
            .insertInto('Characters')
            .values({
                id: newCharacter.id,
                nick: newCharacter.getNick(),
                roomID,
                description: newCharacter.getDescription(),
                isGameMaster: false,
                userID: newCharacter.userID,
                profileIMG: newCharacter.profileIMG,
                submitContent: null,
                submitTimestamp: null
            })
            .executeTakeFirstOrThrow();

        return newCharacter;
    }

    async deleteCharacter(id: UUID): Promise<void> {
        await this.db.deleteFrom('Characters').where('id', '=', id).execute();
    }
}
