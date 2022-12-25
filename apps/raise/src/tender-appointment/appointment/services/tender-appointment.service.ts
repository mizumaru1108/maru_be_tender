import { Injectable } from '@nestjs/common';

import { OAuth2Client } from 'google-auth-library';
import { GoogleCalendarService } from '../../../libs/google-calendar/google-calendar.service';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { TenderUserRepository } from '../../../tender-user/user/repositories/tender-user.repository';
import { CreateAppointmentDto } from '../dtos/requests/create-appointment.dto';
import { SearchClientFilterRequest } from '../dtos/requests/search-client-filter-request.dto';
import { TenderAppointmentRepository } from '../repositories/tender-appointment.repository';

@Injectable()
export class TenderAppointmentService {
  constructor(
    private readonly tenderAppointmentRepository: TenderAppointmentRepository,
    private readonly tenderUserRepository: TenderUserRepository,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  // async createAppointmentOld(code?: string, currentUser?: TenderCurrentUser) {
  //   // if current user (it is hit from endpoint by user)
  //   const result = await this.googleCalendarOAuthService.authorizeOld(code);
  //   // if type of result is OAuth2Client not a login url
  //   if (result instanceof OAuth2Client) {
  //     console.log('already authorize and creating the event');
  //     await this.googleCalendarOAuthService.createEvent(
  //       result,
  //       'testing events',
  //       'testing events descriptions',
  //       new Date().toISOString(), // start
  //       new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // end 1 hour later
  //       'Asia/Bangkok',
  //       ['rdanang.dev@gmail.com', 'haitsam.umar@gmail.com'],
  //     );
  //   }
  //   // const result = await this.tenderAppointmentRepository.createAppointment();
  //   return result;
  // }

  async createAppointment(
    currentUser: TenderCurrentUser,
    request: CreateAppointmentDto,
  ) {
    const {
      summary,
      description,
      start_time,
      end_time,
      time_zone,
      sender,
      receiver,
    } = request;

    const result = await this.googleCalendarService.createEvent(
      currentUser.googleSession!,
      summary,
      description,
      new Date(start_time).toISOString(),
      new Date(end_time).toISOString(),
      time_zone,
      [sender, receiver],
    );
    return result;
  }

  async searchClientByName(searchParams: SearchClientFilterRequest) {
    const result = await this.tenderAppointmentRepository.searchClientByName(
      searchParams,
    );
    return result;
  }
}
