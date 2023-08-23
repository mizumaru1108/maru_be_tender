import { Module } from '@nestjs/common';
import { UserModule } from '../tender-user/user/user.module';
import { TenderAppointmentController } from './appointment/controllers/tender-appointment.controller';
import { TenderAppointmentRepository } from './appointment/repositories/tender-appointment.repository';
import { TenderAppointmentService } from './appointment/services/tender-appointment.service';
import { TenderScheduleController } from './schedule/controllers/tender-schedule.controller';
import { TenderScheduleRepository } from './schedule/repositories/tender-schedule.repository';
import { TenderScheduleService } from './schedule/services/tender-schedule.service';

@Module({
  controllers: [TenderAppointmentController, TenderScheduleController],
  providers: [
    TenderAppointmentService,
    TenderAppointmentRepository,
    TenderScheduleService,
    TenderScheduleRepository,
  ],
  imports: [UserModule],
})
export class TenderAppointmentModule {}
