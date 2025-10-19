import { PingRepository } from './ping/ping.repository.js';

export const repositories = {
    pingRepository: new PingRepository(),
};
