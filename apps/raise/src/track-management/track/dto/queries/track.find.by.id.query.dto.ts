import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TrackIncludeRelationsTypes } from '../../repositories/track.repository';

export class TrackFindByIdQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  include_general?: '1' | '0';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(['1', '0'])
  is_deleted?: '1' | '0';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  include_relations?: TrackIncludeRelationsTypes[];
}
