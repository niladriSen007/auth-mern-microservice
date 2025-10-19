import { AppDataSource } from '../../config/data-source.js';
import { logger } from '../../config/logger.config.js';
import { Roles } from '../../constants/index.js';
import type { RegisterUserBody } from '../../dtos/auth/register-user.request.js';
import { User } from '../../entity/User.js';

export class AuthRepository {
    constructor() {}

    public async registerUser(req: RegisterUserBody) {
        const userRepo = AppDataSource.getRepository(User);
        logger.info('Saving new user to the database', { body: req });
        await userRepo.save({
            role: Roles.CUSTOMER,
            ...req,
        });
        return 'User registered successfully';
    }

    public async findUserByEmail(email: string) {
        logger.info('Finding user by email in the database', { email });
        const userRepo = AppDataSource.getRepository(User);
        return await userRepo.findOne({ where: { email } });
    }
}
