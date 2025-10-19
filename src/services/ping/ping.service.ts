import type { PingRepository } from '../../repositories/ping/ping.repository.js';

export class PingService {
    constructor(private readonly pingRepository: PingRepository) {}

    public ping(): string {
        return this.pingRepository.ping();
    }
}
