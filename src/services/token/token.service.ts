import jwt, { type JwtPayload } from 'jsonwebtoken';
import fs from 'node:fs';
import path from 'node:path';
import { serverConfig } from '../../config/index.js';
import { InternalServerError } from '../../middleware/error/types.js';
import type { User } from '../../entity/User.js';
import type { TokenRepository } from '../../repositories/token/token.repository.js';
import type { RefreshToken } from '../../entity/RefreshToken.js';
import { logger } from '../../config/logger.config.js';

export class TokenService {
    constructor(private readonly tokenRepository: TokenRepository) {}

    public generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer;

        try {
            // Resolve path from project root so it works in both ESM and Jest (CJS) runtimes
            // Avoids using import.meta which is not available under ts-jest's CommonJS transform
            const keyPath = path.resolve(process.cwd(), 'certs', 'private.pem');
            privateKey = fs.readFileSync(keyPath);
        } catch {
            throw new InternalServerError(
                'Error while reading private key - TokenService.generateAccessToken'
            );
        }

        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1d',
            issuer: 'auth-service',
        });

        return accessToken;
    }

    public generateRefreshToken(payload: JwtPayload) {
        const refreshToken = jwt.sign(
            payload,
            serverConfig.REFRESH_TOKEN_SECRET,
            {
                algorithm: 'HS256',
                expiresIn: '1y',
                issuer: 'auth-service',
                jwtid: String(payload.id),
            }
        );

        return refreshToken;
    }

    public persistRefreshToken(user: User): Promise<RefreshToken> {
        logger.info('Generating and persisting refresh token for user', {
            userId: user.id,
        });
        return this.tokenRepository.persistRefreshToken(user);
    }
}
