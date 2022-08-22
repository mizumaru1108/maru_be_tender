import { Module } from '@nestjs/common';
import { AuthzedModule } from '../libs/authzed/authzed.module';
import { BunnyModule } from '../libs/bunny/bunny.module';
import { FusionAuthModule } from '../libs/fusionauth/fusion-auth.module';

@Module({
  imports: [FusionAuthModule, BunnyModule, AuthzedModule],
})
export class SharedModule {}
