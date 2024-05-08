export interface Ack {
    success: boolean;
    error?: string;
}

export interface NewPlayerDetails {
    userID: string;
    nick: string;
    description?: string;
    playerTurnSubmit?: string;
    profileIMG?: string;
}

export interface ClientToServerEvents {
    joinRoom: (roomID: string, callback: (res: Ack) => void) => void;
    subscribeToRoom: (roomID: string, callback: (res: Ack) => void) => void;
}

export interface ServerToClientEvents {
    message: (message: {
        from: string;
        content: string;
        timestamp: string;
    }) => void;
    newPlayer: (player: NewPlayerDetails) => void;
}

export interface InternalEvents {}

export interface SocketData {
    userID: string;
    token: string;
}
