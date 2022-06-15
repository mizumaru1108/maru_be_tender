import { Module } from '@nestjs/common';
import { OperatorService } from './operator.service';
import { OperatorController } from './operator.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OperatorChartData, OperatorChartDataSchema } from './schema/operator-chart.schema';
import { Operator, OperatorSchema } from './schema/operator.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OperatorChartData.name,
        schema: OperatorChartDataSchema,
      },
      {
        name: Operator.name,
        schema: OperatorSchema,
      },
    ]),
  ],
  providers: [OperatorService],
  controllers: [OperatorController],
})
export class OperatorModule {}
