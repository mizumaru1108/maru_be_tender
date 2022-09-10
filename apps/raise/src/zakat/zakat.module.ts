import { Module } from '@nestjs/common';
import { ZakatService } from './zakat.service';
import { ZakatController } from './zakat.controller';
import { MetalPrice, MetalPriceSchema } from './schemas/metalPrice.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DonationLogs,
  DonationLogSchema,
} from 'src/donor/schema/donation_log.schema';
import {
  Organization,
  OrganizationSchema,
} from 'src/organization/schema/organization.schema';
import { Expense, ExpenseSchema } from './schemas/expense.schema';
import { Anonymous, AnonymousSchema } from 'src/donor/schema/anonymous.schema';
import { Campaign, CampaignSchema } from 'src/campaign/schema/campaign.schema';
import { Donor, DonorSchema } from 'src/donor/schema/donor.schema';
import {
  PaymentData,
  PaymentDataSchema,
} from 'src/payment-stripe/schema/paymentData.schema';
import {
  PaymentGateway,
  PaymentGatewaySchema,
} from 'src/payment-stripe/schema/paymentGateway.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { ZakatLog, ZakatLogSchema } from './schemas/zakat_log.schema';

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
        schema: DonationLogSchema,
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
