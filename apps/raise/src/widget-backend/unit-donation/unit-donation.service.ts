import { Injectable } from '@nestjs/common';
import { CreateUnitDonationDto } from './dto/create-unit-donation.dto';

@Injectable()
export class UnitDonationService {
  create(createUnitDonationDto: CreateUnitDonationDto) {
    return 'This action adds a new unitDonation';
  }

  findAll() {
    return `This action returns all unitDonation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} unitDonation`;
  }

  update(id: number, updateUnitDonationDto: CreateUnitDonationDto) {
    return `This action updates a #${id} unitDonation`;
  }

  remove(id: number) {
    return `This action removes a #${id} unitDonation`;
  }
}
