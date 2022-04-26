import { Module } from '@nestjs/common';
import { DonorService } from './donor.service';
import { Donor, DonorSchema } from './donor.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Donor.name,
        schema: DonorSchema,
      },
    ]),
  ],
  providers: [DonorService],
})
export class DonorModule {}
