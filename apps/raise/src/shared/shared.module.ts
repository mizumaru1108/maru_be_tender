import { Module } from '@nestjs/common';
import { AuthzedModule } from '../libs/authzed/authzed.module';
import { BunnyModule } from '../libs/bunny/bunny.module';
import { EmailModule } from '../libs/email/email.module';
import { FusionAuthModule } from '../libs/fusionauth/fusion-auth.module';
import { PaytabsModule } from '../libs/paytabs/paytabs.module';

@Module({
  imports: [
    FusionAuthModule,
    BunnyModule,
    AuthzedModule,
    EmailModule,
    PaytabsModule,
  ],
})
export class SharedModule {}
