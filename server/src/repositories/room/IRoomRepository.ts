import { UUID } from 'crypto';

import { Room } from '@/domain/game/Room';

export interface IRoomRepository {
    fetchRooms(userId: UUID): Room[];
    updateRoom(): void;
    createRoom(): Room;
    deleteRoom(): void;
}
