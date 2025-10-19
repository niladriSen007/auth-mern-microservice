import { AppDataSource } from '../../config/data-source.js';
import { logger } from '../../config/logger.config.js';
import type { RegisterUserRequest } from '../../dtos/auth/register-user.request.js';
import { User } from '../../entity/User.js';

export class AuthRepository {
    constructor() {}

    public async registerUser(req: RegisterUserRequest) {
        const userRepo = AppDataSource.getRepository(User);
        logger.info('Saving new user to the database', { body: req?.body });
        await userRepo.save(req.body);
        return 'User registered successfully';
    }
}
