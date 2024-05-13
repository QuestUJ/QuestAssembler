import {
    ErrorCode,
    MAX_ROOM_NAME_LENGTH,
    MAX_ROOM_PLAYERS,
    QuasmComponent,
    QuasmError
} from '@quasm/common';
import { UUID } from 'crypto';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

export interface RoomSettingsDetails {
    roomName: string;
    maxPlayerCount: number;
}

export class RoomSettings {
    constructor(
        private roomRepository: IRoomRepository,
        private roomID: UUID,
        private roomName: string = '',
        private maxPlayerCount: number = 1
    ) {
        this.validateName(this.roomName);
        this.validateMaxPlayerCount(this.maxPlayerCount);
    }

    validateName(name: string) {
        if (name.length <= 0 || name.length > MAX_ROOM_NAME_LENGTH) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                400,
                ErrorCode.MaxRoomName,
                'Room name too long'
            );
        }
    }

    validateMaxPlayerCount(count: number) {
        if (count < 2 || count > MAX_ROOM_PLAYERS) {
            throw new QuasmError(
                QuasmComponent.ROOM,
                400,
                ErrorCode.IncorrectMaxPlayers,
                'Incorrect max players'
            );
        }
    }

    getName(): string {
        return this.roomName;
    }

    async setName(newName: string) {
        this.validateName(newName);

        await this.roomRepository.updateRoom(this.roomID, {
            roomName: newName
        });

        this.roomName = newName;
    }

    getMaxPlayerCount(): number {
        return this.maxPlayerCount;
    }

    async setMaxPlayerCount(newMaxPlayerCount: number) {
        this.validateMaxPlayerCount(newMaxPlayerCount);

        await this.roomRepository.updateRoom(this.roomID, {
            maxPlayerCount: newMaxPlayerCount
        });

        this.maxPlayerCount = newMaxPlayerCount;
    }
}
