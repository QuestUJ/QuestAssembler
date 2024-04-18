import { randomUUID, UUID } from 'crypto';

import { ICharacterRepository } from '@/repositories/Character/ICharacterRepository';

export class User {
    readonly id: UUID = randomUUID();
    profileIMG: string = '';

    constructor(characterRepository: ICharacterRepository) {
        characterRepository;
    }

    getRooms() {}
}
