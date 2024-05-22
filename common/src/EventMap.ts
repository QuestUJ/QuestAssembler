export interface Ack<T = undefined> {
    success: boolean;
    error?: string;
    payload?: T;
}

export interface SocketPlayerDetails {
    id: string;
    nick: string;
    description?: string;
    profileIMG?: string;
}

export interface SocketMessagePayload {
    roomID: string;
    receiver: string;
    content: string;
}

export interface ChangeCharacterSettingsPayload {
    roomID: string;
    nick: string;
    description: string;
}

export interface ChangeRoomSettingsPayload {
    roomID: string;
    name: string;
    maxPlayers: number;
}

export interface DeleteRoomPayload {
    roomID: string;
}

export interface SubmitActionPayload {
    roomID: string;
    content: string;
}

export interface SubmitActionAck {
    content: string;
    timestamp: string;
}

export interface ClientToServerEvents {
    joinRoom: (roomID: string, callback: (res: Ack) => void) => void;
    leaveRoom: (roomID: string, callback: (res: Ack) => void) => void;
    subscribeToRoom: (roomID: string, callback: (res: Ack) => void) => void;
    changeCharacterSettings: (
        data: ChangeCharacterSettingsPayload,
        callback: (res: Ack) => void
    ) => void;
    changeRoomSettings: (
        data: ChangeRoomSettingsPayload,
        callback: (res: Ack) => void
    ) => void;
    sendMessage: (
        message: SocketMessagePayload,
        callback: (res: Ack<MsgEvent>) => void
    ) => void;
    deleteRoom: (data: DeleteRoomPayload, callback: (res: Ack) => void) => void;
    submitAction: (
        content: SubmitActionPayload,
        callback: (res: Ack<SubmitActionAck>) => void
    ) => void;
}

// ==============================================================================================
export interface MsgEvent {
    id: number;
    roomID: string;
    from: string;
    authorName: string;
    characterPictureURL: string | undefined;
    timestamp: string;
    content: string;
}

export interface RoomSettingsChangeEvent {
    name: string;
    maxPlayers: number;
}

export interface TurnSubmitEvent {
    characterID: string;
    nick: string;
    profileIMG?: string;
    content: string;
    timestamp: string;
}

export interface ServerToClientEvents {
    message: (message: MsgEvent) => void;
    newPlayer: (player: SocketPlayerDetails) => void;
    playerLeft: (player: SocketPlayerDetails) => void;
    changeCharacterDetails: (player: SocketPlayerDetails) => void;
    changeRoomSettings: (roomData: RoomSettingsChangeEvent) => void;
    roomDeletion: () => Promise<void>; // wanted to use navigate and invalidate queries, so async function
    turnSubmit: (submit: TurnSubmitEvent) => void;
    playerReady: (characterID: string) => void;
}

// =============================================================================================

export interface InternalEvents {}

export interface SocketData {
    userID: string;
    token: string;
}
