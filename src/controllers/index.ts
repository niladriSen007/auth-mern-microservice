import { services } from '../services/index.js';
import { AuthController } from './auth/auth.controller.js';

export const controllers = {
    authController: new AuthController(services.authService),
};
