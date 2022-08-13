import { PartialType } from '@nestjs/mapped-types';
import { CreateDonorInfoDto } from './create-donor-info.dto';

export class UpdateDonorInfoDto extends PartialType(CreateDonorInfoDto) {}
