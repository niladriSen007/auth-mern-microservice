import { Router } from 'express';

const authRouter: Router = Router();

authRouter.post('/register', (req, res) => {
    // Registration logic here
    res.status(201).json({ token: 'dummy-token' });
});

export default authRouter;
