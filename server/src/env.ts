export function pickString(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

export function pickInt(key: string, defaultValue: number): number {
    const pick = process.env[key];
    if (!pick) {
        return defaultValue;
    }

    const parsed = parseInt(pick);

    if (!parsed) {
        throw new Error('Cannot parse string env variable to int');
    }

    return parsed;
}

// HTTP
export const PORT = pickInt('PORT', 3000);
export const NODE_ENV = pickString('NODE_ENV', 'development');
export const ALLOWED_ORIGIN = pickString(
    'ALLOWED_ORIGIN',
    'http://localhost:3001'
);

// Postgres
export const PG_USER = pickString('PG_USER', 'postgres');
export const PG_PASSWORD = pickString('PG_PASSWORD', 'root');
export const PG_HOST = pickString('PG_HOST', 'localhost');
export const PG_PORT = pickInt('PG_PORT', 5434);
export const PG_NAME = pickString('PG_NAME', 'quasm');

// Auth0
export const AUTH0_DOMAIN = pickString(
    'AUTH0_DOMAIN',
    'dev-cut6p8lm7mviao58.us.auth0.com'
);
export const AUTH0_AUDIENCE = pickString(
    'AUTH0_AUDIENCE',
    'http://localhost:3000/'
);
