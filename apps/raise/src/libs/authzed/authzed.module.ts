import { Global, Module } from '@nestjs/common';

import { AuthzedService } from './authzed.service';
@Global()
@Module({
  exports: [AuthzedService],
  providers: [AuthzedService],
})
export class AuthzedModule {}
