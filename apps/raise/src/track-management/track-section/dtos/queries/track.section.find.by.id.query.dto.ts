import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { TrackSectionIncludeTypes } from '../../repositories/track.section.repository';

export class TrackSectionFindByIdQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  include_relations?: TrackSectionIncludeTypes[];
}
