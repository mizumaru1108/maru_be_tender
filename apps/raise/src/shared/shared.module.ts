import { Module } from '@nestjs/common';
import { AuthzedModule } from '../libs/authzed/authzed.module';
import { BunnyModule } from '../libs/bunny/bunny.module';
import { EmailModule } from '../libs/email/email.module';
import { FusionAuthModule } from '../libs/fusionauth/fusion-auth.module';
import { PaymentPaytabsModule } from '../libs/payment-paytabs/payment-paytabs.module';

@Module({
  imports: [
    FusionAuthModule,
    BunnyModule,
    AuthzedModule,
    EmailModule,
    PaymentPaytabsModule,
  ],
})
export class SharedModule {}
