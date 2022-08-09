import { Module } from '@nestjs/common';
import { BunnyModule } from '../bunny/bunny.module';
import { FusionAuthModule } from '../fusionauth/fusion-auth.module';

@Module({
  imports: [FusionAuthModule, BunnyModule],
})
export class SharedModule {}
