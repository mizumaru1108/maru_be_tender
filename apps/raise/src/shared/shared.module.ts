import { Module } from '@nestjs/common';
import { AuthzedModule } from '../authzed/authzed.module';
import { BunnyModule } from '../bunny/bunny.module';
import { FusionAuthModule } from '../fusionauth/fusion-auth.module';

@Module({
  imports: [FusionAuthModule, BunnyModule, AuthzedModule],
})
export class SharedModule {}
