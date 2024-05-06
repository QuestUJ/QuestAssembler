import { QuasmComponent } from './Structure';

export interface ApiResponse<Payload> {
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
export interface RoomPayload {
    id: string;
    roomName: string;
    gameMasterName: string;
    currentPlayers: number;
    maxPlayers: number;
    isCurrentUserGameMaster: boolean;
    lastImageUrl: string | undefined;
    lastMessages: string[] | undefined;
}

export type FetchRoomsResponse = ApiResponse<RoomPayload[]>;

// =======================
// /getRoom/
// =======================
export interface PlayerPayload {
    id: string;
    nick: string;
    profilePicture?: string;
}

export interface RoomDetailsPayload {
    id: string;
    roomName: string;
    gameMasterID: string;
    players: PlayerPayload[];
    currentPlayer: PlayerPayload;
}

export type GetRoomResponse = ApiResponse<RoomDetailsPayload>;

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
