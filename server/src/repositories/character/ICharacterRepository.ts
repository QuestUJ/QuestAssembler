import { UUID } from 'crypto';

import { Character } from '@/domain/game/Character';

export interface CharacterDetails {
    nick: string;
    description?: string;
    room: UUID;
}

export interface ICharacterRepository {
    /**
     * Instantiates {@link Character} stores it's details in relavant storage and returns created object'
     */
    createCharacter(details: CharacterDetails): Promise<Character>;
    /**
     * Retrieves all characters of the user with given id
     */
    fetchCharacters(userID: string): Promise<Character[]>;
}
