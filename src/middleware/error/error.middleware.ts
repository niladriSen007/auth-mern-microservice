/* eslint-disable @typescript-eslint/no-unused-vars */

import type { NextFunction, Request, Response } from 'express';
import { logger } from '../../config/logger.config.js';
import type { GlobalError } from './types.js';

export const globalErrorHandler = (
    err: GlobalError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export const genericErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error('Something went wrong!', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
};
