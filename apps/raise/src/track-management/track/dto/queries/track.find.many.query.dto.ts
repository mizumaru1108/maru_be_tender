import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';

export class TrackFindManyQueryDto extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  track_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  include_general?: '1' | '0';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(['1', '0'])
  is_deleted?: '1' | '0';
}
