export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const ALLOWED_ORIGIN =
    process.env.ALLOWED_ORIGIN || 'http://localhost:3001';

export const PG_USER = process.env.PG_USER || 'postgres';
export const PG_PASSWORD = process.env.PG_PASSWORD || 'root';
export const PG_HOST = process.env.PG_HOST || 'localhost';
export const PG_PORT =
    (process.env.PG_PORT ? parseInt(process.env.PG_PORT) : undefined) || 5434;
export const PG_NAME = process.env.PG_NAME || 'quasm';
