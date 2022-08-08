import { Global, Module } from '@nestjs/common';
import { FusionAuthModule } from '../../lib/fusionauth/fusion-auth.module';

@Module({
  imports: [FusionAuthModule],
})
export class SharedModule {}
