import { QuasmComponent } from './QuasmComponent';

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
export interface ApiRoomPayload {
    id: string;
    roomName: string;
    gameMasterName: string;
    currentPlayers: number;
    maxPlayers: number;
    isCurrentUserGameMaster: boolean;
    lastImageUrl: string | undefined;
    lastMessages: string[] | undefined;
}

export type FetchRoomsResponse = ApiResponse<ApiRoomPayload[]>;

// =======================
// /getRoom/
// =======================
export interface ApiPlayerPayload {
    id: string;
    nick: string;
    profilePicture?: string;
}

export interface RoomDetailsPayload {
    id: string;
    roomName: string;
    gameMasterID: string;
    players: ApiPlayerPayload[];
    currentPlayer: ApiPlayerPayload;
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

// =======================
// /fetchMessages/
// =======================
export interface ApiMessagePayload {
    id: number;
    authorName: string;
    characterPictureURL: string | undefined;
    timestamp: Date;
    content: string;
}

export type FetchMessagesResponse = ApiResponse<ApiMessagePayload[]>;

// ======================
// /generateText/
// ======================
export interface GenerateTextPayload {
    generatedText: string;
}

export interface GenerateTextBody {
    prompt: string;
}

export type GenerateTextResponse = ApiResponse<GenerateTextPayload>;
