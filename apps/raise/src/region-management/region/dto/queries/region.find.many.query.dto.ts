import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';

export class RegionFindManyQueryDto extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.toUpperCase();
    }
    return value;
  })
  is_deleted?: 'Y' | 'N';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  include_relations?: string[];
}
