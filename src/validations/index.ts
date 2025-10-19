import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { logger } from '../config/logger.config.js';

export const validateRequestBody = (schema: ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info('Validating request body');
            await schema.parseAsync(req.body);
            logger.info('Request body is valid');
            next();
        } catch (error) {
            // If the validation fails,
            logger.error('Request body is invalid');
            res.status(400).json({
                message: 'Invalid request body',
                success: false,
                error: error,
            });
        }
    };
};

export const validateQueryParams = (schema: ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.query);
            logger.info('Query params are valid');
            next();
        } catch (error) {
            // If the validation fails,

            res.status(400).json({
                message: 'Invalid query params',
                success: false,
                error: error,
            });
        }
    };
};
