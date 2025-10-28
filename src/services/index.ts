import { repositories } from '../repositories/index.js';
import { AuthService } from './auth/auth.service.js';
import { TokenService } from './token/token.service.js';

export const services = {
    authService: new AuthService(repositories.authRepository),
    tokenService: new TokenService(repositories.tokenRepository),
};
