import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthzedService } from './authzed.service';

@Module({
  imports: [ConfigModule],
  exports: [AuthzedService],
  providers: [AuthzedService],
})
export class AuthzedModule {}
