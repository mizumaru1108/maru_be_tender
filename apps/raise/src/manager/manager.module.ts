import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ManagerChartData, ManagerChartDataSchema } from './manager.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ManagerChartData.name,
        schema: ManagerChartDataSchema,
      },
    ]),
  ],
  providers: [ManagerService],
  controllers: [ManagerController],
})
export class ManagerModule {}
