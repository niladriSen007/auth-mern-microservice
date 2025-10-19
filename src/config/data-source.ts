import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entity/User.js';
import { serverConfig } from './index.js';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: serverConfig?.DB_HOST || 'postgres-db',
    port: Number(serverConfig?.DB_PORT) || 5432,
    username: serverConfig?.DB_USER || 'postgres',
    password: serverConfig?.DB_PASSWORD || 'postgres',
    database: serverConfig?.DB_NAME || 'mern_auth_db',
    synchronize: serverConfig?.NODE_ENV !== 'production',
    logging: serverConfig?.NODE_ENV !== 'test',
    entities: [User],
    subscribers: [],
    migrations: [],
});

// Do NOT auto-initialize here. Let the application or tests call initialize() explicitly
