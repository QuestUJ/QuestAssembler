import { QuasmComponent } from './Structure';

interface ApiResponse<Payload> {
    success: boolean;
    payload?: Payload;
    error?: {
        location: QuasmComponent;
        code: number;
        message: string;
    };
}

// Define API types here

// =======================
// /fetchRooms/
// =======================
interface Room {
    id: string;
    roomName: string;
    gameMasterName: string;
    currentPlayers: number;
    maxPlayers: number;
    isCurrentUserGameMaster: boolean;
    lastImageUrl: string | undefined;
    lastMessages: string[] | undefined;
}

export type FetchRoomsResponse = ApiResponse<Room[]>;

// =======================
// /joinRoom/
// =======================
export interface JoinRoomBody {
    gameCode: string;
}

export type JoinRoomResponse = ApiResponse<string>;

// =======================
// /createRoom/
// =======================
export interface CreateRoomBody {
    name: string;
    maxPlayers: number;
}

export type CreateRoomResponse = ApiResponse<string>;
