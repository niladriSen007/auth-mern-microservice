import type { Request } from 'express';

export interface RegisterUserRequest extends Request {
    body: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    };
}

export interface RegisterUserBody {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginUserRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

export interface LoginUserBody {
    email: string;
    password: string;
}
