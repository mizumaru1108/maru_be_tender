import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsIn,
  IsDate,
} from 'class-validator';
import { BaseFilterRequest } from 'src/commons/dtos/base-filter-request.dto';

export class FetchClosingReportListFilterRequest extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  project_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(['after_payment', 'after_submit', 'waiting_to_be_submitted'])
  supervisor_status?:
    | 'after_payment'
    | 'after_submit'
    | 'waiting_to_be_submitted';

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  range_start_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  range_end_date?: Date;
}
