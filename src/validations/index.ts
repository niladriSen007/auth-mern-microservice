import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { logger } from '../config/logger.config.js';
import { HttpStatusCode } from '../utils/status-codes.js';

export const validateRequestBody = (schema: ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info('Validating request body');
            req.body = await schema.parseAsync(req.body);
            logger.info('Request body is valid');
            next();
        } catch (error: unknown) {
            logger.error('Request body is invalid');
            res.status(HttpStatusCode?.BAD_REQUEST).json({
                message: 'Invalid request body',
                success: false,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                error: JSON.parse((error as { message: string })?.message),
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
