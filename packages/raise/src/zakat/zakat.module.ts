import { Module } from '@nestjs/common';
import { ZakatService } from './zakat.service';
import { ZakatController } from './zakat.controller';
import { MetalPrice, MetalPriceSchema } from './metalPrice.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
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
