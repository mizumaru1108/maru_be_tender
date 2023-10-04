import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsNotEmpty, IsIn, IsString } from 'class-validator';
import { TrackIncludeRelationsTypes } from '../../repositories/track.repository';

export class TrackFindByIdQueryDto {
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
