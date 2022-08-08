import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FusionAuthService } from './services/fusion-auth.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [FusionAuthService],
  exports: [FusionAuthService],
})
export class FusionAuthModule {}
