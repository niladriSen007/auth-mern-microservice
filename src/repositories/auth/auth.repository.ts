import type { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source.js';
import { logger } from '../../config/logger.config.js';
import { Roles } from '../../constants/index.js';
import type { RegisterUserBody } from '../../dtos/auth/register-user.request.js';
import type { RegisterUserResponse } from '../../dtos/auth/register-user.response.js';
import { User } from '../../entity/User.js';

export class AuthRepository {
    constructor(private readonly userRepository: Repository<User>) {}

    public async registerUser(
        req: RegisterUserBody
    ): Promise<RegisterUserResponse> {
        logger.info('Saving new user to the database', { body: req });
        const newUser = await this.userRepository.save({
            role: Roles.CUSTOMER,
            ...req,
        });
        return {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role,
        };
    }

    public async findUserByEmail(email: string) {
        logger.info('Finding user by email in the database', { email });
        const userRepo = AppDataSource.getRepository(User);
        return await userRepo.findOne({ where: { email } });
    }
}
