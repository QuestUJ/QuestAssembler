export enum ErrorLocation {
    AUTH = 'Auth',
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
