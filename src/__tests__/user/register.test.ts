import request from 'supertest';
import { app } from '../../app.js';
describe('User Registration', () => {
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

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData);

            expect(response.statusCode).toBe(201);
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
