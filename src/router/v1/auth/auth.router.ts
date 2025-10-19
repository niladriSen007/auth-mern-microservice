import { Router, type Request, type Response } from 'express';
import { controllers } from '../../../controllers/index.js';
import { registerUserSchema } from '../../../validations/auth/register-data.validator.js';
import { validateRequestBody } from '../../../validations/index.js';

const authRouter: Router = Router();

authRouter.post(
    '/register',
    validateRequestBody(registerUserSchema),
    async (req: Request, res: Response) => {
        await controllers.authController.registerUser(req, res);
    }
);

export default authRouter;
