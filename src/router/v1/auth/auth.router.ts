import { Router, type NextFunction, type Response } from 'express';
import { controllers } from '../../../controllers/index.js';
import type { RegisterUserRequest } from '../../../dtos/auth/register-user.request.js';
import { registerUserSchema } from '../../../validations/auth/register-data.validator.js';
import { validateRequestBody } from '../../../validations/index.js';

const authRouter: Router = Router();

authRouter.post(
    '/register',
    validateRequestBody(registerUserSchema),
    async (req: RegisterUserRequest, res: Response, next: NextFunction) => {
        await controllers.authController.registerUser(req, res, next);
    }
);

export default authRouter;
