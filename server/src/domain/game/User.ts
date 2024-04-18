import { randomUUID, UUID } from 'crypto';

import { ICharacterRepository } from '@/repositories/character/ICharacterRepository';

import { Room } from './Room';

export class User {
    readonly id: UUID = randomUUID();
    profileIMG: string = '';

    constructor(characterRepository: ICharacterRepository) {
        characterRepository;
    }

    getRooms(): Room[] {
        return [];
    }
}
