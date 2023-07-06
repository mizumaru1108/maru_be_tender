import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { BaseFilterRequest } from 'src/commons/dtos/base-filter-request.dto';

export class FetchClosingReportListFilterRequest extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  project_name?: string;
}
