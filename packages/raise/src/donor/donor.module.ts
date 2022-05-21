import { Module } from '@nestjs/common';
import { DonorService } from './donor.service';
import { Donor, DonorSchema } from './schema/donor.schema';
import { MongooseModule } from '@nestjs/mongoose';
// import { DonorController } from './donor.controller';
import { DonationLog, DonationLogSchema } from './schema/donation-log.schema';
import { DonorController } from './donor.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Donor.name,
        schema: DonorSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: DonationLog.name,
        schema: DonationLogSchema,
      },
    ]),
  ],
  providers: [DonorService],
  controllers: [DonorController],
})
export class DonorModule {}