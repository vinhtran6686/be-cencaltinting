import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { Public } from '@/shared/decorators/auth.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  check() {
    return this.health.check([
      // Đây là một health check đơn giản chỉ kiểm tra xem ứng dụng có hoạt động không
      () => Promise.resolve({ api: { status: 'up' } }),
    ]);
  }
}
