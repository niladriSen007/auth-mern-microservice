import request from 'supertest';

import type { DataSource } from 'typeorm';

import { truncateTables } from '../../utils/index.js';
import { AppDataSource } from '../../../config/data-source.js';
import { logger } from '../../../config/logger.config.js';
import { app } from '../../../app.js';
import { User } from '../../../entity/User.js';

describe('User Registration', () => {
    let dbConnection: DataSource;

    // Initialize database connection before all tests
    beforeAll(async () => {
        try {
            dbConnection = await AppDataSource.initialize();
            logger.info('Data Source has been initialized in the test suite!');
        } catch (error) {
            logger.error('Error during Data Source initialization:', error);
        }
    });

    // Close database connection after all tests
    afterAll(async () => {
        if (dbConnection && dbConnection.isInitialized) {
            await dbConnection.destroy();
        }
    });

    // Clear database tables before each test or else tests might interfere with each other
    beforeEach(async () => {
        await truncateTables(dbConnection);
    });

    describe('Happy Path', () => {
        it('should register a new user and return status code 201', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'securepassword',
            };

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData);
            expect(response.statusCode).toBe(201);
        });

        it('should return a proper json response upon successful registration', async () => {
            const userData = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                password: 'anothersecurepassword',
            };

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData);

            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('json')
            );
        });

        it('Should persist the user in the database', async () => {
            const userData = {
                firstName: 'Alice',
                lastName: 'Smith',
                email: 'alice.smith@example.com',
                password: 'yetanothersecurepassword',
            };

            await request(app).post('/api/v1/auth/register').send(userData);

            const userRepository = dbConnection.getRepository(User);
            expect(await userRepository.find()).toHaveLength(1);
        });
    });

    describe.skip('Sad Path', () => {
        it('should return status code 400 for invalid user data', async () => {
            const invalidUserData = {
                firstName: '',
                lastName: 'Doe',
                email: 'invalid-email',
                password: 'short',
            };

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(invalidUserData);
            expect(response.statusCode).toBe(400);
        });
    });
});
