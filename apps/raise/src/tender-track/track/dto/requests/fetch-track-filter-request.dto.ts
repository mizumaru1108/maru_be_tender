import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';

export class FetchTrackFilterRequest extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  track_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  include_general?: '1' | '0';
}
