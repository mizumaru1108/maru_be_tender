import { Injectable } from '@nestjs/common';
import { CreateMoneyDonationDto } from './dto/create-money-donation.dto';

@Injectable()
export class MoneyDonationService {
  create(createMoneyDonationDto: CreateMoneyDonationDto) {
    return 'This action adds a new moneyDonation';
  }

  findAll() {
    return `This action returns all moneyDonation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} moneyDonation`;
  }

  update(id: number, updateMoneyDonationDto: CreateMoneyDonationDto) {
    return `This action updates a #${id} moneyDonation`;
  }

  remove(id: number) {
    return `This action removes a #${id} moneyDonation`;
  }
}
