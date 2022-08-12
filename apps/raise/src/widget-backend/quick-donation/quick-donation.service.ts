import { Injectable } from '@nestjs/common';
import { CreateQuickDonationDto } from './dto/create-quick-donation.dto';

@Injectable()
export class QuickDonationService {
  create(createQuickDonationDto: CreateQuickDonationDto) {
    return 'This action adds a new quickDonation';
  }

  findAll() {
    return `This action returns all quickDonation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quickDonation`;
  }

  update(id: number, updateQuickDonationDto: CreateQuickDonationDto) {
    return `This action updates a #${id} quickDonation`;
  }

  remove(id: number) {
    return `This action removes a #${id} quickDonation`;
  }
}
