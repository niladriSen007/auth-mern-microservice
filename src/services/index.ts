import { repositories } from '../repositories/index.js';
import { AuthService } from './auth/auth.service.js';

export const services = {
    authService: new AuthService(repositories.authRepository),
};
