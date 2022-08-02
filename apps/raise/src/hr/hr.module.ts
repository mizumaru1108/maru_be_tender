import { Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hr, HrSchema } from './schema/hr.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Hr.name,
        schema: HrSchema,
      },
    ]),
  ],
  providers: [HrService],
  controllers: [HrController],
})
export class HrModule {}
