import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthzedService } from './authzed.service';
@Global()
@Module({
  imports: [ConfigModule],
  exports: [AuthzedService],
  providers: [AuthzedService],
})
export class AuthzedModule {}
