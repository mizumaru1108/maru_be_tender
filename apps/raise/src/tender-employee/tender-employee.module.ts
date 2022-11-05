import { Module } from '@nestjs/common';
import { TenderEmployeeController } from './controllers/tender-employee.controller';
import { TenderEmployeeService } from './services/tender-employee.service';

@Module({
  controllers: [TenderEmployeeController],
  providers: [TenderEmployeeService],
  exports: [TenderEmployeeService],
})
export class TenderEmployeeModule {}
