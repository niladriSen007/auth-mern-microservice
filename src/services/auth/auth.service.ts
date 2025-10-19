import type { RegisterUserRequest } from '../../dtos/auth/register-user.request.js';
import type { AuthRepository } from '../../repositories/auth/auth.repository.js';

export class AuthService {
    constructor(private readonly authRepository: AuthRepository) {}

    public async registerUser(req: RegisterUserRequest) {
        return await this.authRepository.registerUser(req);
    }
}
