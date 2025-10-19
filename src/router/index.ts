import { Router } from 'express';
import metricsRouter from './v1/metrics/metrics.router.js';
import authRouter from './v1/auth/auth.router.js';

const v1Router: Router = Router();

v1Router.use('/metrics', metricsRouter);
v1Router.use('/auth', authRouter);

export default v1Router;
