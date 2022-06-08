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
import { Organization, OrganizationSchema } from './organization.schema';
import { Donor, DonorSchema } from 'src/donor/schema/donor.schema';

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
        name: Organization.name,
        schema: OrganizationSchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
