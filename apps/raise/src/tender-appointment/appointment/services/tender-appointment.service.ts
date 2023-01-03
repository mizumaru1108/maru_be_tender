import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { appointment, Prisma } from '@prisma/client';

import { v4 as uuidv4 } from 'uuid';
import { GoogleCalendarService } from '../../../libs/google-calendar/google-calendar.service';
import { compareTime } from '../../../tender-commons/utils/time-compare';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { TenderUserRepository } from '../../../tender-user/user/repositories/tender-user.repository';
import { AppointmentFilterRequest } from '../dtos/requests/appointment-filter-request.dto';
import { CreateAppointmentDto } from '../dtos/requests/create-appointment.dto';
import { InvitationResponseDto } from '../dtos/requests/response-invitation.dto';
import { TenderAppointmentRepository } from '../repositories/tender-appointment.repository';

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

    // check if the start time is greater than end time
    const compareResult = compareTime(start_time, end_time);
    if (!compareResult) {
      throw new BadRequestException(
        `Start time on (${start_time}) cannot be greater than end time (${end_time})`,
      );
    }

    // check if there is any appointment in the same time
    const myAppointments =
      await this.tenderAppointmentRepository.findPendingOrApprovedAppointment(
        currentUser.id,
        currentUser.choosenRole,
        new Date(date),
        start_time,
        end_time,
      );
    if (myAppointments) {
      throw new BadRequestException(
        `You have an appointment with ${myAppointments.client.employee_name} (${myAppointments.client.email}) from ${myAppointments.client.client_data?.entity} at ${myAppointments.start_time} - ${myAppointments.end_time}`,
      );
    }

    // create new time with timezone, detect the timezone automatically .toLocaleString without timezone
    const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

    // check if the client is a client account or not
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
    if (
      !result.calendarLink ||
      !result.conferenceLink ||
      !result.calendarEventId
    ) {
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
      calendar_event_id: result.calendarEventId,
      meeting_url: result.conferenceLink,
      calendar_url: result.calendarLink,
      date: new Date(date),
      start_time: start_time,
      end_time: end_time,
      status: 'tentative',
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

  async responseInvitation(
    currentUser: TenderCurrentUser,
    request: InvitationResponseDto,
  ): Promise<appointment> {
    if (
      request.response === 'declined' &&
      (!request.reject_reason || request.reject_reason === '')
    ) {
      throw new BadRequestException('Reject reason cannot be empty!');
    }

    const appointment =
      await this.tenderAppointmentRepository.findAppointmentById(
        currentUser.id,
        currentUser.choosenRole,
        request.appointmentId,
      );
    console.log('appointment', appointment);
    if (!appointment) {
      throw new NotFoundException('Appointment not found!');
    }

    let updatePayload: Prisma.appointmentUpdateInput = {};

    if (request.response === 'declined') {
      updatePayload = {
        status: 'declined',
        reject_reason: request.reject_reason,
      };
    } else if (request.response === 'confirmed') {
      updatePayload = {
        status: 'confirmed',
      };
    }

    const updatedAppointment =
      await this.tenderAppointmentRepository.updateAppointment(
        appointment.id,
        updatePayload,
      );

    return updatedAppointment;
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
