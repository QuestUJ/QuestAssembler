export class GameSettings {
    constructor(
        private _roomName: string = '',
        private _maxPlayers: number = 1
    ) {
        this._roomName;
        this._maxPlayers;
    }

    /**
     * Validates and updates roomName
     */
    setRoomName(name: string) {
        name;
    }

    getRoomName(): string {
        return '';
    }

    /**
     * Validates and updates maxPlayers
     */
    setMaxPlayers(maxPlayers: number) {
        maxPlayers;
    }

    getMaxPlayers(): number {
        return -1;
    }
}
