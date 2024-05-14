import {
    MAX_CHARACTER_DESCRIPTION_LENGTH,
    MAX_CHARACTER_NICK_LENGTH,
    MAX_PLAYER_SUBMIT_LENGTH,
    MAX_ROOM_NAME_LENGTH,
    MAX_ROOM_PLAYERS,
    MAX_STORY_CHUNK_LENGTH
} from './constant';
import { QuasmComponent } from './QuasmComponent';

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
    RoomNotFound = 'room.not.found',
    MaxPlayersExceeded = 'max.players.exceeded',
    MaxRoomName = 'max.room.name',
    RoomNameEmpty = 'room.name.empty',
    IncorrectMaxPlayers = 'incorrect.max.players',
    MaxPlayersNotInteger = 'max.players.not.integer',
    MaxPlayersTooMany = 'max.players.too.many',
    MaxPlayersTooFew = 'max.players.too.few',
    UserExists = 'user.exists',
    ChunkLengthExceeded = 'chunk.length.exceeded',
    UnauthorizedSettingsChange = 'unauthorized.settings.change',
    PlayerLimitTooSmallForCurrentPlayerCount = 'player.limit.too.small.for.current.player.count',

    // Character related
    NickLengthTooLong = 'nick.length.too.long',
    NickLengthEmpty = 'nick.length.empty',
    DescriptionLength = 'description.length',
    MaxPlayerSubmitExceeded = 'max.playersubmit.exceeded',
    CharacterNotFound = 'character.not.found',

    // Chat related,
    MissingChat = 'missing.chat',
    MessagesLimit = 'messages.limit',
    MessageLength = 'message.length',
    IncorrectMessageDetails = 'incorrect.message.details'
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

    [ErrorCode.RoomNotFound]: 'Room has not been found',
    [ErrorCode.MaxPlayersExceeded]:
        'The room reached maximum number of players',
    [ErrorCode.MaxRoomName]: `Name of the room cannot be longer than ${MAX_ROOM_NAME_LENGTH}`,
    [ErrorCode.RoomNameEmpty]: `Name of the room cannot be empty`,
    [ErrorCode.IncorrectMaxPlayers]: `Player limit cannot be less than 2 or bigger than ${MAX_ROOM_PLAYERS}`,
    [ErrorCode.MaxPlayersNotInteger]: `Player limit must be an integer`,
    [ErrorCode.MaxPlayersTooMany]: `Player limit must be under ${MAX_ROOM_PLAYERS}`,
    [ErrorCode.MaxPlayersTooFew]: `Player limit must be bigger or equal to 2`,
    [ErrorCode.UserExists]: `You have already joined this room`,
    [ErrorCode.ChunkLengthExceeded]: `Story Chunk length cannot be longer than ${MAX_STORY_CHUNK_LENGTH}`,
    [ErrorCode.UnauthorizedSettingsChange]: `This user can't update room settings!`,
    [ErrorCode.PlayerLimitTooSmallForCurrentPlayerCount]: `You can't change player limit below the current number of players!`,

    [ErrorCode.NickLengthEmpty]: `Player nick cannot be empty`,
    [ErrorCode.NickLengthTooLong]: `Player nick cannot be longer than ${MAX_CHARACTER_NICK_LENGTH}`,
    [ErrorCode.DescriptionLength]: `Player description cannot be longer than ${MAX_CHARACTER_DESCRIPTION_LENGTH}`,
    [ErrorCode.MaxPlayerSubmitExceeded]: `Player Submit cannot be longer than ${MAX_PLAYER_SUBMIT_LENGTH}`,
    [ErrorCode.CharacterNotFound]: `Character has not been found`,

    [ErrorCode.MissingChat]: `Could not find appropriate chat`,
    [ErrorCode.MessagesLimit]: `Limit of messages per chat has been reached`,
    [ErrorCode.MessageLength]: `Message is too long`,
    [ErrorCode.IncorrectMessageDetails]: `Message contains incorrect information`
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
