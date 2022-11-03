import { Module } from '@nestjs/common';
import { TenderAppointmentController } from './appointment/controllers/tender-appointment.controller';
import { TenderAppointmentService } from './appointment/services/tender-appointment.service';
import { TenderScheduleController } from './schedule/controllers/tender-schedule.controller';
import { TenderScheduleService } from './schedule/services/tender-schedule.service';

@Module({
  controllers: [TenderAppointmentController, TenderScheduleController],
  providers: [TenderAppointmentService, TenderScheduleService],
})
export class TenderAppointmentModule {}
