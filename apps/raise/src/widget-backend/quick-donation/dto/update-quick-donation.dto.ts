import { PartialType } from '@nestjs/mapped-types';
import { CreateQuickDonationDto } from './create-quick-donation.dto';

export class UpdateQuickDonationDto extends PartialType(CreateQuickDonationDto) {}
