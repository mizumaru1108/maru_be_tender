import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitDonationDto } from './create-unit-donation.dto';

export class UpdateUnitDonationDto extends PartialType(CreateUnitDonationDto) {}
