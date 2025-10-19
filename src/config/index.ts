import { config } from 'dotenv';
import type { ServerConfig } from './types.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function loadDotEnv() {
    const env = config({
        path: path.join(
            __dirname,
            `../../.env.${process.env.NODE_ENV || 'development'}`
        ),
    });
    if (env.error) {
        throw env.error;
    }
    return 'Environment variables loaded successfully';
}
loadDotEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) ?? 5501,
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    LOGGER_LEVEL: process.env.LOGGER_LEVEL ?? 'info',
    DB_HOST: process.env.DB_HOST ?? 'localhost',
    DB_PORT: Number(process.env.DB_PORT) ?? 5432,
    DB_USER: process.env.DB_USER ?? 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD ?? 'postgres',
    DB_NAME: process.env.DB_NAME ?? 'mern_auth_db',
};
