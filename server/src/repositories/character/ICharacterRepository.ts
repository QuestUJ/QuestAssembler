import { UUID } from 'crypto';

import { Character, CharacterDetails } from '@/domain/game/character/Character';
import { PlayerTurnSubmit } from '@/domain/game/story/PlayerTurnSubmit';

export interface ICharacterRepository {
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

    /**
     * Deletes the character based on id
     */
    deleteCharacter(id: UUID): Promise<void>;
    /**
     * Sets the characters turn action
     */
    setTurnSubmit(
        characterID: UUID,
        content: string
    ): Promise<PlayerTurnSubmit>;

    resetTurnSubmit(characterID: UUID): Promise<void>;
}
