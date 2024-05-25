import { QuasmComponent } from './QuasmComponent';
import { ErrorCode } from './QuasmError';

export interface ApiResponse<Payload> {
    success: boolean;
    payload?: Payload;
    error?: {
        location: QuasmComponent;
        code: ErrorCode;
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
    profileIMG?: string;
    isReady: boolean;
}

export interface RoomDetailsPayload {
    id: string;
    roomName: string;
    gameMasterID: string;
    currentPlayer: ApiPlayerPayload;
}

export type GetRoomResponse = ApiResponse<RoomDetailsPayload>;

// =======================
// /getRoomPlayers/
// =======================
export type GetRoomPlayersResponse = ApiResponse<ApiPlayerPayload[]>;

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
export interface ApiGenerateTextPayload {
    generatedText: string;
}

export interface GenerateTextBody {
    prompt: string;
}

export type GenerateTextResponse = ApiResponse<ApiGenerateTextPayload>;

// ======================
// /getTurnSubmit/
// ======================
interface TurnSubmit {
    content: string;
    timestamp: string;
}

export type ApiTurnSubmitPayload = TurnSubmit | null;

export type GetTurnSubmitResponse = ApiResponse<ApiTurnSubmitPayload>;

// ======================
// /fetchTurnSubmits/
// ======================
export interface ApiTurnSubmitWithCharacterPayload {
    characterID: string;
    profileIMG?: string;
    nick: string;
    submit: ApiTurnSubmitPayload;
}

export type FetchTurnSubmitsResponse = ApiResponse<
    ApiTurnSubmitWithCharacterPayload[]
>;

// ======================
// /fetchStory/
// ======================
export interface ApiStoryChunk {
    id: number;
    content: string;
    imageURL?: string;
}

export type FetchStoryResponse = ApiResponse<ApiStoryChunk[]>;
