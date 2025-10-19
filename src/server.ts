/* eslint-disable no-console */
import 'reflect-metadata';
import { app } from './app.js';
import { serverConfig } from './config/index.js';

const startServer = () => {
    try {
        const PORT = serverConfig?.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();
