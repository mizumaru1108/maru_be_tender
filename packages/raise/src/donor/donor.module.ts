import { Module } from '@nestjs/common';
import { DonorService } from './donor.service';
import { Donor, DonorSchema } from './schema/donor.schema';
import { MongooseModule } from '@nestjs/mongoose';
// import { DonorController } from './donor.controller';
import { DonationLog, DonationLogSchema } from './schema/donation-log.schema';
import {
  DonationLogs,
  DonationLogSchema as DonationLogsSchema,
} from './schema/donation_log.schema';
import { DonorController } from './donor.controller';
import { Anonymous, AnonymousSchema } from './schema/anonymous.schema';

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
        name: DonationLog.name,
        schema: DonationLogSchema,
      },
      {
        name: DonationLogs.name,
        schema: DonationLogsSchema,
      },
    ]),
  ],
  providers: [DonorService],
  controllers: [DonorController],
})
export class DonorModule {}
