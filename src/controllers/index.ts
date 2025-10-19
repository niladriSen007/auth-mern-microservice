import { services } from '../services/index.js';
import { PingController } from './ping/ping.controller.js';

export const controllers = {
    pingController: new PingController(services.pingService),
};
