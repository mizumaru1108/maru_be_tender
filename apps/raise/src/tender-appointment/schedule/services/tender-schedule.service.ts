import { Injectable } from '@nestjs/common';

@Injectable()
export class TenderScheduleService {
  create() {
    return 'This action adds a new tenderAppointment';
  }

  findAll() {
    return `This action returns all tenderAppointment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tenderAppointment`;
  }

  update() {}

  remove(id: number) {
    return `This action removes a #${id} tenderAppointment`;
  }
}
