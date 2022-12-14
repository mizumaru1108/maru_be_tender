import { Injectable } from '@nestjs/common';
import { GoogleCalendarOAuthService } from '../../../libs/google-calendar/google-calendar-oauth.service';
import { GoogleCalendarServiceAccountService } from '../../../libs/google-calendar/google-calendar-service-account.service';

import { SearchClientFilterRequest } from '../dtos/requests/search-client-filter-request.dto';
import { TenderAppointmentRepository } from '../repositories/tender-appointment.repository';
import { OAuth2Client } from 'google-auth-library';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';

@Injectable()
export class TenderAppointmentService {
  constructor(
    private readonly tenderAppointmentRepository: TenderAppointmentRepository,
    private readonly googleCalendarOAuthService: GoogleCalendarOAuthService,
    private readonly googleCalendarServiceAccountService: GoogleCalendarServiceAccountService,
  ) {}

  async serviceAccount() {
    const result = await this.googleCalendarServiceAccountService.createEvent(
      'testing events',
      'testing events descriptions',
      new Date().toISOString(), // start
      new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // end 1 hour later
      'Asia/Bangkok',
      ['rdanang.dev@gmail.com', 'haitsam.umar@gmail.com'],
    );
    return result;
  }

  // via oauth
  async oauth() {
    const result = await this.googleCalendarOAuthService.authorize();
    console.log(result);
    return result;
  }

  async createAppointment(code?: string, currentUser?: TenderCurrentUser) {
    const result = await this.googleCalendarOAuthService.authorize(code);
    // if type of result is OAuth2Client
    if (result instanceof OAuth2Client) {
      console.log('already authorize and creating the event');
      await this.googleCalendarOAuthService.createEvent(
        result,
        'testing events',
        'testing events descriptions',
        new Date().toISOString(), // start
        new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // end 1 hour later
        'Asia/Bangkok',
        ['rdanang.dev@gmail.com', 'haitsam.umar@gmail.com'],
      );
    }
    // const result = await this.tenderAppointmentRepository.createAppointment();
    return result;
  }

  async searchClientByName(searchParams: SearchClientFilterRequest) {
    const result = await this.tenderAppointmentRepository.searchClientByName(
      searchParams,
    );
    return result;
  }
}
