import { Injectable } from '@nestjs/common';
import { CreateGiftDonationDto } from './dto/create-gift-donation.dto';

@Injectable()
export class GiftDonationService {
  create(createGiftDonationDto: CreateGiftDonationDto) {
    return 'This action adds a new giftDonation';
  }

  findAll() {
    return `This action returns all giftDonation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} giftDonation`;
  }

  update(id: number, updateGiftDonationDto: CreateGiftDonationDto) {
    return `This action updates a #${id} giftDonation`;
  }

  remove(id: number) {
    return `This action removes a #${id} giftDonation`;
  }
}
