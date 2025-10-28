import type { NextFunction, Response } from 'express';
import { logger } from '../../config/logger.config.js';
import type {
    LoginUserRequest,
    RegisterUserRequest,
} from '../../dtos/auth/register-user.request.js';
import type { AuthService } from '../../services/auth/auth.service.js';
import { HttpStatusCode } from '../../utils/status-codes.js';
import type { JwtPayload } from 'jsonwebtoken';
import type {
    LoginUserResponse,
    RegisterUserResponse,
} from '../../dtos/auth/register-user.response.js';
import type { TokenService } from '../../services/token/token.service.js';
import type { User } from '../../entity/User.js';
import type { RefreshToken } from '../../entity/RefreshToken.js';

export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService
    ) {}

    public async registerUser(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            logger.info('Registering a new user', { body: req?.body });
            const result: RegisterUserResponse =
                await this.authService.registerUser(req);
            logger.info('User registered successfully');

            const payload: JwtPayload = {
                sub: result.id,
                email: result.email,
                role: result.role,
                firstName: result.firstName,
                lastName: result.lastName,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            logger.info('Access token generated successfully for the new user');

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 1, // 1d
                httpOnly: true, // Very important
            });
            const refreshTokenResponse: RefreshToken =
                await this.tokenService.persistRefreshToken(result as User);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(refreshTokenResponse.id),
            });

            logger.info(
                'Refresh token generated successfully for the new user'
            );

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
                httpOnly: true, // Very important
            });

            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    ...result,
                    accessToken,
                    refreshToken,
                },
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

    public async login(
        req: LoginUserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            logger.info('Logging in user', { body: req?.body });
            const result: LoginUserResponse =
                await this.authService.loginUser(req);
            logger.info('User logged in successfully');

            const payload: JwtPayload = {
                sub: result.id,
                email: result.email,
                role: result.role,
                firstName: result.firstName,
                lastName: result.lastName,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            logger.info('Access token generated successfully for the user');

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 1, // 1d
                httpOnly: true, // Very important
            });
            const refreshTokenResponse: RefreshToken =
                await this.tokenService.persistRefreshToken(result as User);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(refreshTokenResponse.id),
            });

            logger.info('Refresh token generated successfully for the user');

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
                httpOnly: true, // Very important
            });

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: 'User logged in successfully',
                data: {
                    ...result,
                    accessToken,
                    refreshToken,
                },
            });
            return result;
        } catch (error) {
            logger.error('Error logging in user');
            next(
                error
                    ? error
                    : new Error('Unknown error - AuthController.login')
            );
            return;
        }
    }
}
