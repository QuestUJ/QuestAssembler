export enum ErrorLocation {
    AUTH = 'Authorization',
    DATABASE = 'Database',
    SOCKET = 'Socket',
    HTTP = 'HTTP',
    CONFIG = 'Config',
    VALIDATION = 'Validation',
    OTHER = 'Other'
}

export class QuasmError extends Error {
    constructor(
        public errorLocation: ErrorLocation,
        public statusCode: number,
        message: string
    ) {
        super(message);
    }

    formattedError() {
        return `Error in ${this.errorLocation} with code ${this.statusCode}: ${this.message}`;
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
