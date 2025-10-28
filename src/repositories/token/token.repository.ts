import type { Repository } from 'typeorm';
import type { User } from '../../entity/User.js';
import type { RefreshToken } from '../../entity/RefreshToken.js';
import { logger } from '../../config/logger.config.js';

export class TokenRepository {
    constructor(
        private readonly refreshTokenRepository: Repository<RefreshToken>
    ) {}

    public async persistRefreshToken(user: User): Promise<RefreshToken> {
        logger.info('Persisting refresh token in the database', {
            userId: user.id,
        });
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // 1Y -> (Leap year)
        const newRefreshToken = await this.refreshTokenRepository.save({
            user: user,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        });
        logger.info('Persisted refresh token in the database', {
            userId: user.id,
        });
        return newRefreshToken;
    }
}
