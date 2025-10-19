import type { PingService } from '../../services/ping/ping.service.js';

export class PingController {
    constructor(private readonly pingService: PingService) {}

    public ping(): string {
        return this.pingService.ping();
    }
}
