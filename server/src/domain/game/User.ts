import { randomUUID, UUID } from 'crypto';

import { Room } from './Room';

export class User {
    readonly id: UUID = randomUUID();
    profileIMG: string = '';

    /**
     * @returns rooms that the user is in
     */
    getRooms(): Room[] {
        return [];
    }
}
