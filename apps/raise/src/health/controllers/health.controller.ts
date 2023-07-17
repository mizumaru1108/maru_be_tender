import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  constructor() {}

  @Get('startup')
  startup() {
    return {};
  }

  @Get('liveness')
  liveness() {
    return {};
  }

  @Get('readiness')
  readiness() {
    // TODO: use Terminus + PrismaHealthIndicator
    // https://docs.nestjs.com/recipes/terminus
    return {};
  }
}
