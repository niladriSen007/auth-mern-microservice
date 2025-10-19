import { repositories } from '../repositories/index.js';
import { PingService } from './ping/ping.service.js';

export const services = {
    pingService: new PingService(repositories.pingRepository),
};
