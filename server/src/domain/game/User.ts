import { randomUUID, UUID } from 'crypto';

export class User {
    readonly id: UUID = randomUUID();
    profileIMG: string = ''
}
