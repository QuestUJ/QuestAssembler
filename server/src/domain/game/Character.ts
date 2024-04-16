import { randomUUID, UUID } from 'crypto';

import { PlayerTurnSubmit } from './PlayerTurnSubmit';

export class Character {
    readonly id: UUID = randomUUID();
    nick: string = '';
    description: string = '';
    room: UUID = randomUUID();
    private playerTurnSubmits: PlayerTurnSubmit[] = [];

    isGameMaster(): boolean {
        return false;
    }

    getPlayerTurnSubmit(): PlayerTurnSubmit | undefined {
        return undefined;
    }

    setNick(newName: string): void {
        this.nick = newName;
    }

    getNick(): string {
        return '';
    }

    setDescription(newName: string): void {
        newName;
    }

    getDescription(): string {
        return '';
    }
}
