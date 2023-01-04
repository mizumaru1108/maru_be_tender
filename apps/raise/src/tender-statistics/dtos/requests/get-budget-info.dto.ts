import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { BaseFilterRequest } from '../../../commons/dtos/base-filter-request.dto';

export class GetBudgetInfoDto extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsDateString()
  end_date?: string;
}
