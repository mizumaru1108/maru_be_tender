import { PartialType } from '@nestjs/mapped-types';
import { CreateMoneyDonationDto } from './create-money-donation.dto';

export class UpdateMoneyDonationDto extends PartialType(CreateMoneyDonationDto) {}
