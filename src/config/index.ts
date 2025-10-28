import { config } from 'dotenv';
import path from 'path';
import type { ServerConfig } from './types.js';

// Resolve .env path without using import.meta so this works under Jest (CJS) and Node ESM
const envPath = path.resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || 'development'}`
);

(() => {
    const result = config({ path: envPath });
    // Ignore missing file in certain environments (like tests); only throw on non-ENOENT errors
    if (
        result.error &&
        (result.error as NodeJS.ErrnoException).code !== 'ENOENT'
    ) {
        throw result.error;
    }
})();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) ?? 5501,
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    LOGGER_LEVEL: process.env.LOGGER_LEVEL ?? 'info',
    DB_HOST: process.env.DB_HOST ?? 'postgres-db',
    DB_PORT: Number(process.env.DB_PORT) ?? 5432,
    DB_USER: process.env.DB_USER ?? 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD ?? 'postgres',
    DB_NAME: process.env.DB_NAME ?? 'mern_auth_db',
    REFRESH_TOKEN_SECRET:
        process.env.REFRESH_TOKEN_SECRET ?? 'your_refresh_token_secret',
};
