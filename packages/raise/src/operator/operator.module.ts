import { Module } from '@nestjs/common';
import { OperatorService } from './operator.service';
import { OperatorController } from './operator.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OperatorChartData, OperatorChartDataSchema } from './operator.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OperatorChartData.name,
        schema: OperatorChartDataSchema,
      },
    ]),
  ],
  providers: [OperatorService],
  controllers: [OperatorController],
})
export class OperatorModule {}
