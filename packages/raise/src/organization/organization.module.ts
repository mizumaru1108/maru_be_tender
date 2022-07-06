import { Module } from '@nestjs/common';
// import { OrgsService } from './orgs.service';
// import { OrgsController } from './orgs.controller';
import { ConfigModule } from '@nestjs/config';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DonationLogs,
  DonationLogSchema,
} from 'src/donor/schema/donation_log.schema';
import { Organization, OrganizationSchema } from './schema/organization.schema';
import { Donor, DonorSchema } from 'src/donor/schema/donor.schema';
import {
  PaymentGateway,
  PaymentGatewaySchema,
} from 'src/payment-stripe/schema/paymentGateway.schema';
import { Campaign, CampaignSchema } from 'src/campaign/campaign.schema';
import { Appearance, AppearanceSchema } from './schema/appearance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Appearance.name,
        schema: AppearanceSchema,
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
        name: Organization.name,
        schema: OrganizationSchema,
      },
      {
        name: PaymentGateway.name,
        schema: PaymentGatewaySchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
