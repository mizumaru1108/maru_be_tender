import { Module } from '@nestjs/common';
import { PaymentPaytabsService } from './payment-paytabs.service';
import { PaymentPaytabsController } from './payment-paytabs.controller';

@Module({
  providers: [PaymentPaytabsService],
  controllers: [PaymentPaytabsController]
})
export class PaymentPaytabsModule {}
