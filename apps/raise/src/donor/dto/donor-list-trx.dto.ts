import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseFilterRequest } from 'src/commons/dtos/base-filter-request.dto';

export class DonorListTrxDto extends BaseFilterRequest {
  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @IsOptional()
  @IsString()
  createdAt: string;

  @IsOptional()
  @IsString()
  donationStatus: string;

  @IsOptional()
  @IsString()
  amount: string;

  @IsOptional()
  @IsString()
  donorName: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  exZktList: string;
}
