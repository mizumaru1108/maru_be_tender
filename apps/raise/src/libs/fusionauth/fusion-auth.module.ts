import { Global, Module } from '@nestjs/common';
import { FusionAuthService } from './services/fusion-auth.service';

@Global()
@Module({
  providers: [FusionAuthService],
  exports: [FusionAuthService],
})
export class FusionAuthModule {}
