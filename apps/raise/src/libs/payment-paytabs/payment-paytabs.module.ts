import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentPaytabsService } from './payment-paytabs.service';
import { PaymentPaytabsController } from './payment-paytabs.controller';
import {
  DonationLogs,
  DonationLogSchema,
} from 'src/donor/schema/donation_log.schema';
import {
  PaymentData,
  PaymentDataSchema,
} from 'src/payment-stripe/schema/paymentData.schema';
import {
  PaymentGateway,
  PaymentGatewaySchema,
} from 'src/payment-stripe/schema/paymentGateway.schema';
import { Donor, DonorSchema } from 'src/donor/schema/donor.schema';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DonationLogs.name,
        schema: DonationLogSchema,
      },
      {
        name: Donor.name,
        schema: DonorSchema,
      },
      {
        name: PaymentData.name,
        schema: PaymentDataSchema,
      },
      {
        name: PaymentGateway.name,
        schema: PaymentGatewaySchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [PaymentPaytabsService],
  controllers: [PaymentPaytabsController],
})
export class PaymentPaytabsModule {}
