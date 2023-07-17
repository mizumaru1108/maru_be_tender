import { Module } from '@nestjs/common';
import { HealthController } from 'src/health/controllers/health.controller';

const controllers = [HealthController];
@Module({
  controllers: [...controllers],
})
export class HealthModule {}
