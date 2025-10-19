import express, { type Express } from 'express';
import {
    genericErrorHandler,
    globalErrorHandler,
} from './middleware/error/error.middleware.js';
import apiRouter from './router/index.js';

export const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routers
app.use('/api', apiRouter);

// Error handlers must be registered last
app.use(globalErrorHandler);
app.use(genericErrorHandler);
