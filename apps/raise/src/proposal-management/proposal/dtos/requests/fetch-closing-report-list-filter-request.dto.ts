import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsIn } from 'class-validator';
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
}
