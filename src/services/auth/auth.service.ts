import createHttpError from 'http-errors';
import type { RegisterUserRequest } from '../../dtos/auth/register-user.request.js';
import type { AuthRepository } from '../../repositories/auth/auth.repository.js';
import { HttpStatusCode } from '../../utils/status-codes.js';

export class AuthService {
    constructor(private readonly authRepository: AuthRepository) {}

    public async registerUser(req: RegisterUserRequest) {
        try {
            return await this.authRepository.registerUser(req);
        } catch {
            const err = createHttpError(
                HttpStatusCode?.INTERNAL_SERVER_ERROR,
                'Error registering new user',
                'AuthService.registerUser'
            );
            throw err;
        }
    }
}
