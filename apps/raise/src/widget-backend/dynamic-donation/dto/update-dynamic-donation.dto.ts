import { PartialType } from '@nestjs/mapped-types';
import { CreateDynamicDonationDto } from './create-dynamic-donation.dto';

export class UpdateDynamicDonationDto extends PartialType(CreateDynamicDonationDto) {}
