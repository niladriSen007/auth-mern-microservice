import { Router } from "express"
import { collectDefaultMetrics, Registry } from "prom-client"

const metricsRouter: Router = Router()

const register = new Registry()

collectDefaultMetrics({ register });
metricsRouter.get("/", async (req, res) => {
  try {
    res.setHeader("Content-Type", register.contentType);
    const metrics = await register.metrics();
    res.send(metrics);
  } catch {
    res.status(500).send("Error collecting metrics");
  }
})

export default metricsRouter
