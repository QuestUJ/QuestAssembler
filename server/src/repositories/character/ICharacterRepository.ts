import { UUID } from 'crypto';

import { Character } from '@/domain/game/Character';

interface CharacterDetails {
    nick: string;
    description: string | undefined;
    room: UUID;
}

export interface ICharacterRepository {
    /**
     * instantiates {@link Character} stores it's details in relavant storage and returns created object'
     */
    createCharacter(details: CharacterDetails): Character;
    /**
     * Retrieves all characters of the user with given id
     */
    fetchCharacters(userID: string): Character[];
}
