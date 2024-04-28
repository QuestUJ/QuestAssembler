import { QuasmComponent } from './Structure';

/**
 * Indicates what type of error we'are facing'
 */
export enum ErrorCode {
    MissingConfig = 'missing.config',
    MissingAccessToken = 'missing.access.token'
}

/**
 * Defines user friendly messages describing errors
 */
export const ErrorMap: Record<ErrorCode, string> = {
    [ErrorCode.MissingAccessToken]:
        'Authorization failed! missing access token, try to log out and log in again',
    [ErrorCode.MissingConfig]: 'Fatal error, missing configuration'
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
