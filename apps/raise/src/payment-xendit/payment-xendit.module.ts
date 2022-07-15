import { Module } from '@nestjs/common';
import { PaymentXenditService } from './payment-xendit.service';
import { PaymentXenditController } from './payment-xendit.controller';

@Module({
  providers: [PaymentXenditService],
  controllers: [PaymentXenditController]
})
export class PaymentXenditModule {}
