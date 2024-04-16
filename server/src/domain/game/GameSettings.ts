export class GameSettings {
    roomName: string = '';
    maxPlayerCount: number = 5;

    constructor(roomName: string, maxPlayerCount: number) {
        this.roomName = roomName;
        this.maxPlayerCount = maxPlayerCount;
    }
}
