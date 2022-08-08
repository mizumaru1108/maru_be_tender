import { Module } from '@nestjs/common';
import { BunnyModule } from '../../lib/bunny/bunny.module';
import { FusionAuthModule } from '../../lib/fusionauth/fusion-auth.module';

@Module({
  imports: [FusionAuthModule, BunnyModule],
})
export class SharedModule {}
