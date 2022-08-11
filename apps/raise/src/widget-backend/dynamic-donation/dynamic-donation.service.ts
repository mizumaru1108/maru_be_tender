import { Injectable } from '@nestjs/common';
import { CreateDynamicDonationDto } from './dto/create-dynamic-donation.dto';
import { UpdateDynamicDonationDto } from './dto/update-dynamic-donation.dto';

@Injectable()
export class DynamicDonationService {
  create(createDynamicDonationDto: CreateDynamicDonationDto) {
    return 'This action adds a new dynamicDonation';
  }

  findAll() {
    return `This action returns all dynamicDonation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dynamicDonation`;
  }

  update(id: number, updateDynamicDonationDto: UpdateDynamicDonationDto) {
    return `This action updates a #${id} dynamicDonation`;
  }

  remove(id: number) {
    return `This action removes a #${id} dynamicDonation`;
  }
}
