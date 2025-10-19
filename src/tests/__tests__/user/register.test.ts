import request from 'supertest';

import type { DataSource } from 'typeorm';

import { app } from '../../../app.js';
import { AppDataSource } from '../../../config/data-source.js';
import { logger } from '../../../config/logger.config.js';
import { Roles } from '../../../constants/index.js';
import { User } from '../../../entity/User.js';

const REGISTER_API_ENDPOINT = '/api/v1/auth/register';

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
        await dbConnection?.dropDatabase();
        await dbConnection?.synchronize();
        /*   await truncateTables(dbConnection); */
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
                .post(REGISTER_API_ENDPOINT)
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
                .post(REGISTER_API_ENDPOINT)
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

            await request(app).post(REGISTER_API_ENDPOINT).send(userData);

            const userRepository = dbConnection.getRepository(User);
            expect(await userRepository.find()).toHaveLength(1);
        });

        it('Should return the correct user first name from the database', async () => {
            const userData = {
                firstName: 'Bob',
                lastName: 'Johnson',
                email: 'bob.johnson@example.com',
                password: 'supersecurepassword',
            };

            await request(app).post(REGISTER_API_ENDPOINT).send(userData);

            const userRepository = dbConnection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]!.firstName).toBe('Bob');
        });

        it('Should return the correct user last name from the database', async () => {
            const userData = {
                firstName: 'Charlie',
                lastName: 'Brown',
                email: 'charlie.brown@example.com',
                password: 'yetanothersecurepassword',
            };

            await request(app).post(REGISTER_API_ENDPOINT).send(userData);

            const userRepository = dbConnection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]!.lastName).toBe('Brown');
        });

        it('Should assign the default role "customer" to the newly registered user', async () => {
            const userData = {
                firstName: 'Diana',
                lastName: 'Prince',
                email: 'diana.prince@example.com',
                password: 'securepassword',
            };

            await request(app).post(REGISTER_API_ENDPOINT).send(userData);

            const userRepository = dbConnection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]!).toHaveProperty('role');
            expect(users[0]!.role).toBe(Roles.CUSTOMER);
        });

        it('should store the hashed password in the database', async () => {
            const userData = {
                firstName: 'Eve',
                lastName: 'Adams',
                email: 'eve.adams@example.com',
                password: 'securepassword',
            };

            await request(app).post(REGISTER_API_ENDPOINT).send(userData);

            const userRepository = dbConnection.getRepository(User);
            const users = await userRepository.find({
                select: ['password'],
            });
            expect(users[0]?.password).not.toBe(userData.password);
            expect(users[0]?.password).toHaveLength(60);
            expect(users[0]?.password).toMatch(/^\$2[a|b]\$\d+\$/);
        });

        it('should return 400 status code if email is already exists', async () => {
            // Arrange
            const userData = {
                firstName: 'Rakesh',
                lastName: 'K',
                email: 'rakesh@mern.space',
                password: 'password',
            };
            const userRepository = dbConnection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });

            // Act
            const response = await request(app)
                .post(REGISTER_API_ENDPOINT)
                .send(userData);

            const users = await userRepository.find();
            // Assert
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });
    });

    describe('Sad Path', () => {
        it('should return status code 400 for invalid user data', async () => {
            const invalidUserData = {
                firstName: '',
                lastName: 'Doe',
                email: 'invalid-email',
                password: 'short',
            };

            const response = await request(app)
                .post(REGISTER_API_ENDPOINT)
                .send(invalidUserData);
            expect(response.statusCode).toBe(400);
        });

        it('should return 400 status code if email field is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'Rakesh',
                lastName: 'K',
                email: '',
                password: 'password',
            };
            // Act
            const response = await request(app)
                .post(REGISTER_API_ENDPOINT)
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = dbConnection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });

        it('should return 400 status code if firstName is missing', async () => {
            // Arrange
            const userData = {
                firstName: '',
                lastName: 'K',
                email: 'rakesh@mern.space',
                password: 'password',
            };
            // Act
            const response = await request(app)
                .post(REGISTER_API_ENDPOINT)
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = dbConnection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
        it('should return 400 status code if lastName is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'Rakesh',
                lastName: '',
                email: 'rakesh@mern.space',
                password: 'password',
            };
            // Act
            const response = await request(app)
                .post(REGISTER_API_ENDPOINT)
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = dbConnection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });

        it('should return 400 status code if password is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'Rakesh',
                lastName: 'K',
                email: 'rakesh@mern.space',
                password: '',
            };
            // Act
            const response = await request(app)
                .post(REGISTER_API_ENDPOINT)
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = dbConnection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
    });

    describe('Fields are not in proper format', () => {
        it('should trim the email field', async () => {
            // Arrange
            const userData = {
                firstName: 'Diana',
                lastName: 'Prince',
                email: ' diana.prince@example.com ',
                password: 'securepassword',
            };
            // Act
            await request(app).post(REGISTER_API_ENDPOINT).send(userData);

            // Assert
            const userRepository = dbConnection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]!.email).toBe('diana.prince@example.com');
            /* expect(users[0]!).toHaveProperty('email'); */
        });
        it('should return 400 status code if email is not a valid email', async () => {
            // Arrange
            const userData = {
                firstName: 'Rakesh',
                lastName: 'K',
                email: 'rakesh_mern.space', // Invalid email
                password: 'password',
            };
            // Act
            const response = await request(app)
                .post(REGISTER_API_ENDPOINT)
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = dbConnection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
        it.skip('should return 400 status code if password length is less than 8 chars', async () => {
            // Arrange
            const userData = {
                firstName: 'Rakesh',
                lastName: 'K',
                email: 'rakesh@mern.space',
                password: 'pass', // less than 8 chars
            };
            // Act
            const response = await request(app)
                .post(REGISTER_API_ENDPOINT)
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = dbConnection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
    });
});
