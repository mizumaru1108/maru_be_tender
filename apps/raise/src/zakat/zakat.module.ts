import { Module } from '@nestjs/common';
import { ZakatService } from './zakat.service';
import { ZakatController } from './zakat.controller';
import { MetalPrice, MetalPriceSchema } from './schemas/metalPrice.schema';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Organization,
  OrganizationSchema,
} from 'src/organization/schema/organization.schema';
import { Expense, ExpenseSchema } from './schemas/expense.schema';
import { Campaign, CampaignSchema } from 'src/campaign/schema/campaign.schema';
import { Donor, DonorSchema } from 'src/donor/schema/donor.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { ZakatLog, ZakatLogSchema } from './schemas/zakat_log.schema';
import {
  DonationLogs,
  DonationLogsSchema,
} from '../donation/schema/donation_log.schema';
import {
  PaymentData,
  PaymentDataSchema,
} from '../donation/schema/paymentData.schema';
import {
  PaymentGateway,
  PaymentGatewaySchema,
} from '../donation/schema/paymentGateway.schema';
import { Anonymous, AnonymousSchema } from '../donor/schema/anonymous.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Anonymous.name,
        schema: AnonymousSchema,
      },
      {
        name: Campaign.name,
        schema: CampaignSchema,
      },
      {
        name: DonationLogs.name,
        schema: DonationLogsSchema,
      },
      {
        name: Donor.name,
        schema: DonorSchema,
      },
      {
        name: Expense.name,
        schema: ExpenseSchema,
      },
      {
        name: MetalPrice.name,
        schema: MetalPriceSchema,
      },
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
      {
        name: PaymentData.name,
        schema: PaymentDataSchema,
      },
      {
        name: PaymentGateway.name,
        schema: PaymentGatewaySchema,
      },
      { name: User.name, schema: UserSchema },
      {
        name: ZakatLog.name,
        schema: ZakatLogSchema,
      },
    ]),
  ],
  providers: [ZakatService],
  controllers: [ZakatController],
})
export class ZakatModule {}
