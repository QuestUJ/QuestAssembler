import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { UUID } from 'crypto';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

interface Args {
    roomID: UUID;
    userID: string;
    roomRepo: IRoomRepository;
}

export async function getRoomCheckUser({ roomID, userID, roomRepo }: Args) {
    const room = await roomRepo.getRoomByID(roomID);

    if (!room.characters.hasUser(userID)) {
        throw new QuasmError(
            QuasmComponent.HTTP,
            400,
            ErrorCode.RoomNotFound,
            'Player not in room'
        );
    }

    return room;
}
