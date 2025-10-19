import express, { type Express } from 'express';
import {
    genericErrorHandler,
    globalErrorHandler,
} from './middleware/error/error.middleware.js';
import { InternalServerError } from './middleware/error/types.js';
import v1Router from './router/index.js';

export const app: Express = express();

app.use(globalErrorHandler);
app.use(genericErrorHandler);

app.get('/', (req, res) => {
    try {
        res.status(200).send('Auth Service is running!');
    } catch {
        throw new InternalServerError();
    }
});

app.use('/api/v1', v1Router);
