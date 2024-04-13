import { randomUUID, UUID } from 'crypto';

import { PlayerTurnSubmit } from './PlayerTurnSubmit';

export class Character {
    readonly id: UUID = randomUUID();
    nick: string = '';
    description: string = '';
    room: UUID = randomUUID();
    userID: string = '123';

    isGameMaster(): boolean {
        return false;
    }

    getPlayerTurnSubmit(): PlayerTurnSubmit | undefined {
        return undefined;
    }
}
