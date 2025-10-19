import { z } from 'zod';

export const registerUserSchema = z.object({
    firstName: z
        .string({ message: 'First name must be present' })
        .min(2)
        .max(100),
    lastName: z
        .string({ message: 'Last name must be present' })
        .min(2)
        .max(100),
    email: z
        .string({ message: 'Email must be present' })
        .email('Invalid email format'),
    // Typical bcrypt-safe limits: 8-72
    password: z
        .string({ message: 'Password must be present' })
        .min(1, 'Password must be at least 8 characters')
        .max(72, 'Password must be at most 72 characters'),
});
