import request from 'supertest';
import { app } from '../app.js';
describe('App', () => {
    it('adds 1 + 2 to equal 3', () => {
        expect(1 + 2).toBe(3);
    });

    it('GET /health should return 200 OK', async () => {
        const response = await request(app).get('/');
        expect(response?.statusCode).toBe(200);
        expect(response.text).toBe('Auth Service is running!');
    });
});
