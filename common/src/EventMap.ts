import { UserDetails } from './Auth';

interface Ack {
    success: boolean;
    error?: string;
}

interface CharacterDetails {
    name: string;
    image: string;
}

export interface ClientToServerEvents {
    joinRoom: (
        roomID: string,
        character: CharacterDetails,
        callback: (res: Ack) => void
    ) => void;
    subscribeToRoom: (roomID: string, callback: (res: Ack) => void) => void;
}

export interface ServerToClientEvents {
    message: (message: {
        from: string;
        content: string;
        timestamp: string;
    }) => void;
}

export interface InternalEvents {}

export interface SocketData {
    user: UserDetails;
}
