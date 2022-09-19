import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Donor, DonorSchema } from 'src/donor/schema/donor.schema';

import {
  PaymentGateway,
  PaymentGatewaySchema,
} from 'src/donation/schema/paymentGateway.schema';
import { PaytabsService } from './services/paytabs.service';
import {
  PaymentData,
  PaymentDataSchema,
} from '../../donation/schema/paymentData.schema';
import {
  DonationLogs,
  DonationLogsSchema,
} from '../../donation/schema/donation_log.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DonationLogs.name,
        schema: DonationLogsSchema,
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
  ],
  providers: [PaytabsService],
  exports: [PaytabsService],
})
export class PaytabsModule {}
