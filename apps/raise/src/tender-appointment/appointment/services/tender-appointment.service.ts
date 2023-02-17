import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { appointment, Prisma } from '@prisma/client';

import { v4 as uuidv4 } from 'uuid';
import { isExistAndValidPhone } from '../../../commons/utils/is-exist-and-valid-phone';
import { SendEmailDto } from '../../../libs/email/dtos/requests/send-email.dto';
import { EmailService } from '../../../libs/email/email.service';
import { GoogleCalendarService } from '../../../libs/google-calendar/google-calendar.service';
import { TwilioService } from '../../../libs/twilio/services/twilio.service';
import { compareTime } from '../../../tender-commons/utils/time-compare';
import { CreateManyNotificationDto } from '../../../tender-notification/dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { TenderNotificationService } from '../../../tender-notification/services/tender-notification.service';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { TenderUserRepository } from '../../../tender-user/user/repositories/tender-user.repository';
import { AppointmentFilterRequest } from '../dtos/requests/appointment-filter-request.dto';
import { CreateAppointmentDto } from '../dtos/requests/create-appointment.dto';
import { InvitationResponseDto } from '../dtos/requests/response-invitation.dto';
import { TenderAppointmentRepository } from '../repositories/tender-appointment.repository';
import { Credentials } from 'google-auth-library';

@Injectable()
export class TenderAppointmentService {
  constructor(
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly emailService: EmailService,
    private readonly twilioService: TwilioService,
    private readonly tenderNotificationService: TenderNotificationService,
    private readonly tenderAppointmentRepository: TenderAppointmentRepository,
    private readonly tenderUserRepository: TenderUserRepository,
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
      currentUser.googleSession as Credentials, // consider that is exist because the guard will not allowed if it's undefined
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

    // Notification
    const subject = `Tender's New Appointment`;
    const appointmentTime = `${dayOfWeek}, ${date} at ${start_time} - ${end_time}`;
    const clientContent = `New Appointment request from ${currentUser.email}, on ${appointmentTime}`;
    const employeeContent = `Successfully sent appointment invitation to ${client.email}, details:  ${appointmentTime}`;

    // via email
    const clientEmailPayload: SendEmailDto = {
      mailType: 'template',
      to: appointment.client.email,
      from: 'no-reply@hcharity.org',
      subject,
      templatePath: 'tender/ar/appointment/appointment-invitation',
      templateContext: {
        clientUserName: appointment.client.employee_name,
        employeeUsername: appointment.employee.employee_name || 'Tender Admin',
        appointmentDate: appointmentTime,
      },
    };
    const employeeEmailPayload: SendEmailDto = {
      mailType: 'plain',
      to: appointment.employee.email,
      subject,
      content: employeeContent,
      from: 'no-reply@hcharity.org',
    };

    this.emailService.sendMail(clientEmailPayload);
    this.emailService.sendMail(employeeEmailPayload);

    // via web app
    const createNotifPayload: CreateManyNotificationDto = {
      payloads: [
        {
          type: 'APPOINTMENT',
          user_id: appointment.client.id,
          appointment_id: appointment.id,
          content: clientContent,
          subject,
        },
        {
          type: 'APPOINTMENT',
          user_id: appointment.employee.id,
          appointment_id: appointment.id,
          content: employeeContent,
          subject,
        },
      ],
    };
    await this.tenderNotificationService.createMany(createNotifPayload);

    // via sms
    const clientPhone = isExistAndValidPhone(appointment.client.mobile_number);
    if (clientPhone) {
      this.twilioService.sendSMS({
        to: clientPhone,
        body: subject + ',' + clientContent,
      });
    }

    const employeeNumber = isExistAndValidPhone(
      appointment.employee.mobile_number,
    );
    if (employeeNumber) {
      this.twilioService.sendSMS({
        to: employeeNumber,
        body: subject + ',' + employeeContent,
      });
    }

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
    // console.log('appointment', appointment);
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

    const {
      date,
      day,
      start_time,
      end_time,
      meeting_url,
      client,
      employee,
      updated_at,
    } = updatedAppointment;

    const clientEmailPayload: SendEmailDto = {
      mailType: 'plain',
      to: client.email,
      from: 'no-reply@hcharity.org',
    };
    const employeeEmailPayload: SendEmailDto = {
      mailType: 'plain',
      to: employee.email,
      from: 'no-reply@hcharity.org',
    };

    let clientNotif: CreateNotificationDto | undefined = undefined;
    let employeeNotif: CreateNotificationDto | undefined = undefined;

    if (request.response === 'declined') {
      // client payload
      clientEmailPayload.subject = "Tender's Appointment Declined";
      clientEmailPayload.content = `Your appointment with ${
        employee.email
      } on ${day}, ${date} at ${start_time} - ${end_time} has been cancelled at ${
        new Date(updated_at!).toLocaleDateString
      }. Reason: ${request.reject_reason}`;

      clientNotif = {
        type: 'APPOINTMENT',
        user_id: client.id,
        appointment_id: appointment.id,
        subject: clientEmailPayload.subject,
        content: clientEmailPayload.content,
      };
      // client payload

      // employee payload
      employeeEmailPayload.subject = "Tender's Appointment Declined";
      employeeEmailPayload.content = `Your appointment request with ${
        client.email
      } on ${day}, ${date} at ${start_time} - ${end_time} has been declined at ${
        new Date(updated_at!).toLocaleDateString
      }. Reason: ${request.reject_reason}`;

      employeeNotif = {
        type: 'APPOINTMENT',
        user_id: employee.id,
        appointment_id: appointment.id,
        subject: employeeEmailPayload.subject,
        content: employeeEmailPayload.content,
      };
      // employee payload
    } else if (request.response === 'confirmed') {
      // client payload
      clientEmailPayload.subject = "Tender's Appointment Confirmed";
      clientEmailPayload.content = `Your appointment request with ${
        employee.email
      } on ${day}, ${date} at ${start_time} - ${end_time} has been confirmed at ${
        new Date(updated_at!).toLocaleDateString
      }. Meeting url: ${meeting_url}`;

      clientNotif = {
        type: 'APPOINTMENT',
        user_id: client.id,
        appointment_id: appointment.id,
        subject: clientEmailPayload.subject,
        content: clientEmailPayload.content,
      };
      // client payload

      // employee payload
      employeeEmailPayload.subject = "Tender's Appointment Confirmed";
      employeeEmailPayload.content = `Your appointment request with ${
        client.email
      } on ${day}, ${date} at ${start_time} - ${end_time} has been confirmed at ${
        new Date(updated_at!).toLocaleDateString
      }. Meeting url: ${meeting_url}`;

      employeeNotif = {
        type: 'APPOINTMENT',
        user_id: employee.id,
        appointment_id: appointment.id,
        subject: employeeEmailPayload.subject,
        content: employeeEmailPayload.content,
      };
      // employee payload
    }

    // send email
    this.emailService.sendMail(clientEmailPayload);
    this.emailService.sendMail(employeeEmailPayload);

    // send web app notif
    if (clientNotif && employeeNotif) {
      await this.tenderNotificationService.createMany({
        payloads: [clientNotif, employeeNotif],
      });
    }

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
