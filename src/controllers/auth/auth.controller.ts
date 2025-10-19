import type { NextFunction, Response } from 'express';
import { logger } from '../../config/logger.config.js';
import type { RegisterUserRequest } from '../../dtos/auth/register-user.request.js';
import type { AuthService } from '../../services/auth/auth.service.js';
import { HttpStatusCode } from '../../utils/status-codes.js';

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    public async registerUser(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            logger.info('Registering a new user', { body: req?.body });
            const result = await this.authService.registerUser(req);
            logger.info('User registered successfully');
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: 'User registered successfully',
                data: result,
            });
            return result;
        } catch (error) {
            logger.error('Error creating a new user');
            next(
                error
                    ? error
                    : new Error('Unknown error - AuthController.registerUser')
            );
            return;
        }
    }
}
