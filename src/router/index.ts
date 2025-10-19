import { Router } from "express";
import metricsRouter from "./v1/metrics/metrics.router.js";

const v1Router: Router = Router();

v1Router.use("/metrics", metricsRouter)

export default v1Router;