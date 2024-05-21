import { UUID } from 'crypto';

import { Character, CharacterDetails } from '@/domain/game/character/Character';

export interface ICharacterRepository {
    getCharacter(roomID: UUID, userID: UUID): Promise<Character>;

    /**
     * Just persists some character attributes changes
     */
    updateCharacter(
        id: UUID,
        character: Partial<CharacterDetails>
    ): Promise<void>;

    /**
     * Instantiates character based on provided details adds it to Room and persists changes
     */
    addCharacter(
        roomID: UUID,
        characterDetails: CharacterDetails
    ): Promise<Character>;
}
