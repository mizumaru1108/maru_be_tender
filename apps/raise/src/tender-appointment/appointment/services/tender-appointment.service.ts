import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { GoogleCalendarService } from '../../../libs/google-calendar/google-calendar.service';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { TenderUserRepository } from '../../../tender-user/user/repositories/tender-user.repository';
import { CreateAppointmentDto } from '../dtos/requests/create-appointment.dto';
import { TenderAppointmentRepository } from '../repositories/tender-appointment.repository';
import { v4 as uuidv4 } from 'uuid';
import { BaseFilterRequest } from '../../../commons/dtos/base-filter-request.dto';
import { AppointmentFilterRequest } from '../dtos/requests/appointment-filter-request.dto';

@Injectable()
export class TenderAppointmentService {
  constructor(
    private readonly tenderAppointmentRepository: TenderAppointmentRepository,
    private readonly tenderUserRepository: TenderUserRepository,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async createAppointment(
    currentUser: TenderCurrentUser,
    request: CreateAppointmentDto,
  ) {
    const { date, start_time, end_time, client_id } = request;

    // create new time with timezone, detect the timezone automatically .toLocaleString without timezone
    const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

    const client = await this.tenderUserRepository.findUserById(client_id);
    if (!client) throw new NotFoundException('Client not found!');
    const clientRoles = client?.roles.map((role) => role.user_type_id);
    if (clientRoles && clientRoles?.indexOf('CLIENT') === -1) {
      throw new BadRequestException('Your partner is not a client!');
    }

    const startTime = new Date(
      new Date(`${date} ${start_time}`).toLocaleString('en-US', {
        timeZone: timezone,
      }),
    ).toISOString();

    const endTime = new Date(
      new Date(`${date} ${end_time}`).toLocaleString('en-US', {
        timeZone: timezone,
      }),
    ).toISOString();

    const result = await this.googleCalendarService.createEvent(
      currentUser.googleSession!,
      "Tender's Appointment",
      "Tender's Appointment",
      startTime,
      endTime,
      timezone,
      [currentUser.email, client.email],
    );
    if (!result.calendarId || !result.calendarLink || !result.conferenceLink) {
      throw new BadRequestException('Failed to generate meeting url!');
    }

    // get day of week as Monday, Tuesday, etc from date
    const dayOfWeek = new Date(date)
      .toLocaleString('en-US', {
        weekday: 'long',
      })
      .split(',')[0];

    const appointmentCreatePayload: Prisma.appointmentCreateInput = {
      id: uuidv4(),
      calendar_id: result.calendarId,
      meeting_url: result.conferenceLink,
      calendar_url: result.calendarLink,
      date: new Date(date),
      start_time: start_time,
      end_time: end_time,
      status: 'WAITING_FOR_ACCEPTANCE',
      employee: {
        connect: {
          id: currentUser.id,
        },
      },
      client: {
        connect: {
          id: client_id,
        },
      },
      day: dayOfWeek,
    };

    const appointment =
      await this.tenderAppointmentRepository.createAppointment(
        appointmentCreatePayload,
      );

    return appointment;
  }

  async getMyAppointment(
    currentUser: TenderCurrentUser,
    filter: AppointmentFilterRequest,
  ): Promise<any> {
    const appointments =
      await this.tenderAppointmentRepository.findAppointments(
        currentUser.id,
        currentUser.choosenRole,
        filter,
      );
    return appointments;
  }
}
