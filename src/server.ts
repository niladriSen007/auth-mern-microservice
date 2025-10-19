/* eslint-disable no-console */
import 'reflect-metadata';
import { app } from './app.js';
import { serverConfig } from './config/index.js';
import { AppDataSource } from './config/data-source.js';

const startServer = () => {
    try {
        const PORT = serverConfig?.PORT || 4000;
        // Initialize the database connection
        AppDataSource.initialize()
            .then(() => {
                console.log('Data Source has been initialized!');
            })
            .catch((error) => {
                console.error('Error during Data Source initialization', error);
            });
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();
