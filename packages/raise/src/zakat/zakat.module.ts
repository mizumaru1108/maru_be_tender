import { Module } from '@nestjs/common';
import { ZakatService } from './zakat.service';
import { ZakatController } from './zakat.controller';
import { MetalPrice, MetalPriceSchema } from './metalPrice.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import {
  DonationLogs,
  DonationLogSchema,
} from 'src/donor/schema/donation_log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DonationLogs.name,
        schema: DonationLogSchema,
      },
      {
        name: MetalPrice.name,
        schema: MetalPriceSchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [ZakatService],
  controllers: [ZakatController],
})
export class ZakatModule {}
