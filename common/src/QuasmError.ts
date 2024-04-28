import {
    MAX_CHARACTER_DESCRIPTION_LENGTH,
    MAX_CHARACTER_NICK_LENGTH,
    MAX_ROOM_NAME_LENGTH,
    MAX_ROOM_PLAYERS
} from './constant';
import { QuasmComponent } from './Structure';

/**
 * Indicates what type of error we'are facing'
 */
export enum ErrorCode {
    Unexpected = 'unexpected',

    // Config
    MissingConfig = 'missing.config',

    // Access token related stuff
    MissingAccessToken = 'missing.access.token',
    IncorrectAccessToken = 'incorrect.access.token',

    // Room related
    MaxPlayersExceeded = 'max.players.exceeded',
    MaxRoomName = 'max.room.name',
    IncorrectMaxPlayers = 'incorrect.max.players',

    // Character related
    NickLength = 'nick.length',
    DescriptionLength = 'description.length'
}

/**
 * Defines user friendly messages describing errors
 */
export const ErrorMap: Record<ErrorCode, string> = {
    [ErrorCode.Unexpected]:
        'An unexpected error has occurred, please try again.',

    [ErrorCode.MissingConfig]: 'Fatal error, missing configuration',

    [ErrorCode.MissingAccessToken]:
        'Authorization failed! Missing access token, try to log out and log in again',
    [ErrorCode.IncorrectAccessToken]:
        'Authorization failed! Incorrect access token',

    [ErrorCode.MaxPlayersExceeded]:
        'The room reached maximum number of players',
    [ErrorCode.MaxRoomName]: `Name of the room cannot be empty or longer than ${MAX_ROOM_NAME_LENGTH}`,
    [ErrorCode.IncorrectMaxPlayers]: `Player limit cannot be bigger than ${MAX_ROOM_PLAYERS}`,

    [ErrorCode.NickLength]: `Player nick cannot be empty or longer than ${MAX_CHARACTER_NICK_LENGTH}`,
    [ErrorCode.DescriptionLength]: `Player description cannot be longer than ${MAX_CHARACTER_DESCRIPTION_LENGTH}`
};

export class QuasmError extends Error {
    /**
     * @param errorLocation info in which component of the system error occured
     * @param statusCode HTTP error code corresponding to this error
     * @param errorCode error code describing what happened
     * @param message Additional context for maintainers this won't be sent to the user so you should put any useful information and context for developers here
     */
    constructor(
        public readonly errorLocation: QuasmComponent,
        public readonly statusCode: number,
        public readonly errorCode: ErrorCode,
        message: string
    ) {
        super(message);
    }

    toString() {
        return `Error in: ${this.errorLocation}, Status: ${this.statusCode}, Code: ${this.errorCode}, message: ${this.message}`;
    }
}

/**
 * Helper function to extract error string message if don't know type of Error
 */
export function extractMessage(e: unknown): string {
    if (e instanceof Error) {
        return e.message;
    }

    if (typeof e === 'string') {
        return e;
    }

    return `Unkown unexpected error!`;
}
