import { z } from 'zod';

export const loginUserSchema = z.object({
    email: z
        .string({ message: 'Email must be present' })
        .trim()
        .email('Invalid email format'),
    // Typical bcrypt-safe limits: 8-72
    password: z
        .string({ message: 'Password must be present' })
        .trim()
        .min(1, 'Password must be at least 1 characters')
        .max(72, 'Password must be at most 72 characters'),
});
