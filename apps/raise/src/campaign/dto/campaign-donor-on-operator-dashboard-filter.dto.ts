import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { BaseFilterRequest } from '../../commons/dtos/base-filter-request.dto';

export class CampaignDonorOnOperatorDasboardFilter extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  minDonationCount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  maxDonationCount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  minTotalDonation: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  maxTotalDonation: number;
}
