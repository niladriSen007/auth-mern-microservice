import type { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source.js';
import { AuthRepository } from './auth/auth.repository.js';
import { TokenRepository } from './token/token.repository.js';
import type { User } from '../entity/User.js';
import type { RefreshToken } from '../entity/RefreshToken.js';

const userRepository: Repository<User> = AppDataSource.getRepository('User');
const refreshTokenRepository: Repository<RefreshToken> =
    AppDataSource.getRepository('RefreshToken');

export const repositories = {
    authRepository: new AuthRepository(userRepository),
    tokenRepository: new TokenRepository(refreshTokenRepository),
};
