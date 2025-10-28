import bcrypt from 'bcryptjs';
import { logger } from '../../config/logger.config.js';
import type {
    LoginUserRequest,
    RegisterUserRequest,
} from '../../dtos/auth/register-user.request.js';
import { BadRequestError } from '../../middleware/error/types.js';
import type { AuthRepository } from '../../repositories/auth/auth.repository.js';
import type { LoginUserResponse } from '../../dtos/auth/register-user.response.js';

export class AuthService {
    constructor(private readonly authRepository: AuthRepository) {}

    public async registerUser(req: RegisterUserRequest) {
        try {
            const existingUser = await this.authRepository.findUserByEmail(
                req.body.email
            );
            if (existingUser) {
                throw new BadRequestError(
                    'Email already in use - AuthService.registerUser'
                );
            }

            const hashedPass = await bcrypt.hash(req.body.password, 10);
            return await this.authRepository.registerUser({
                ...req.body,
                password: hashedPass,
            });
        } catch (error) {
            // If we intentionally threw a BadRequestError above, propagate it unchanged
            if (error instanceof BadRequestError) {
                throw error;
            }
            logger.error('Error registering new user', { error });
            throw new BadRequestError(
                'Error registering new user - AuthService.registerUser'
            );
        }
    }

    public async loginUser(req: LoginUserRequest): Promise<LoginUserResponse> {
        logger.info('Logging in user', { body: req?.body });
        const { email, password } = req.body;
        const user = await this.authRepository.findUserByEmail(email);
        if (!user) {
            throw new BadRequestError(
                'Invalid email or password - AuthService.loginUser'
            );
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestError(
                'Invalid email or password - AuthService.loginUser'
            );
        }
        logger.info('User logged in successfully', { userId: user.id });
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };
    }
}
