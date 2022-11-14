import { Injectable } from '@nestjs/common';
import { GoogleCalendarService } from '../../../libs/google-calendar/google-calendar.service';

import { SearchClientFilterRequest } from '../dtos/requests/search-client-filter-request.dto';
import { TenderAppointmentRepository } from '../repositories/tender-appointment.repository';

@Injectable()
export class TenderAppointmentService {
  constructor(
    private readonly tenderAppointmentRepository: TenderAppointmentRepository,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async create() {
    const result = await this.googleCalendarService.createEvent(
      'testing events',
      'testing events descriptions',
      new Date().toISOString(), // start
      new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // end 1 hour later
      'Asia/Bangkok',
      ['rdanang.dev@gmail.com', 'haitsam.umar@gmail.com'],
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
