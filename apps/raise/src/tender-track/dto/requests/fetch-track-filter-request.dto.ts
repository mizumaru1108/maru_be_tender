import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterRequest } from '../../../commons/dtos/base-filter-request.dto';
import { IsString, IsOptional } from 'class-validator';

export class FetchTrackFilterRequest extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  track_name?: string;
}
