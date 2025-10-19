import { Router } from 'express';
import metricsRouter from './metrics/metrics.router.js';
import authRouter from './auth/auth.router.js';

const v1Router: Router = Router();

v1Router.use('/metrics', metricsRouter);
v1Router.use('/auth', authRouter);

export default v1Router;
