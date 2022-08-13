import { PartialType } from '@nestjs/mapped-types';
import { CreateGiftDonationDto } from './create-gift-donation.dto';

export class UpdateGiftDonationDto extends PartialType(CreateGiftDonationDto) {}
