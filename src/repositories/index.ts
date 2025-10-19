import { AuthRepository } from './auth/auth.repository.js';

export const repositories = {
    authRepository: new AuthRepository(),
};
