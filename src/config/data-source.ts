import { DataSource } from 'typeorm';
import { serverConfig } from './index.js';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: serverConfig?.DB_HOST || 'localhost',
    port: Number(serverConfig?.DB_PORT) || 5432,
    username: serverConfig?.DB_USER || 'postgres',
    password: serverConfig?.DB_PASSWORD || 'postgres',
    database: serverConfig?.DB_NAME || 'mern_auth_db',
    synchronize: serverConfig?.NODE_ENV !== 'production',
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [],
});
