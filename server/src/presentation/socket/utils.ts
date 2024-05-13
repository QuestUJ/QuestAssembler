import { Room } from '@/domain/game/room/Room';

import { QuasmSocket } from './socketServer';

export function isMemberOf(socket: QuasmSocket, room: Room) {
    return !!room.characters
        .getCharacters()
        .find(ch => ch.userID === socket.data.userID);
}
