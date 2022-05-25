import { Module } from '@nestjs/common';
import { ZakatService } from './zakat.service';
import { ZakatController } from './zakat.controller';
import { MetalPrice, MetalPriceSchema } from './schemas/metalPrice.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import {
  DonationLogs,
  DonationLogSchema,
} from 'src/donor/schema/donation_log.schema';
import { Expense, ExpenseSchema } from './schemas/expense.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DonationLogs.name,
        schema: DonationLogSchema,
      },
      {
        name: Expense.name,
        schema: ExpenseSchema,
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
