import type { Request } from 'express';

export interface RegisterUserRequest extends Request {
    body: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    };
}
