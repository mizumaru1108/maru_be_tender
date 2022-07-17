import { Module } from '@nestjs/common';
import { DonorService } from './donor.service';
import { Donor, DonorSchema } from './schema/donor.schema';
import { Volunteer, VolunteerSchema } from './schema/volunteer.schema';
import { MongooseModule } from '@nestjs/mongoose';
// import { DonorController } from './donor.controller';
import { DonationLog, DonationLogSchema } from './schema/donation-log.schema';
import {
  DonationLogs,
  DonationLogSchema as DonationLogsSchema,
} from './schema/donation_log.schema';
import { DonorController } from './donor.controller';
import { Anonymous, AnonymousSchema } from './schema/anonymous.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Anonymous.name,
        schema: AnonymousSchema,
      },
      {
        name: Donor.name,
        schema: DonorSchema,
      },
      {
        name: Volunteer.name,
        schema: VolunteerSchema,
      },
      {
        name: DonationLog.name,
        schema: DonationLogSchema,
      },
      {
        name: DonationLogs.name,
        schema: DonationLogsSchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [DonorService],
  controllers: [DonorController],
})
export class DonorModule {}