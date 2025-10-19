import { config } from 'dotenv';
import type { ServerConfig } from './types.js';

function loadDotEnv() {
    const env = config();
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
};
