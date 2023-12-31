import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { BannerTypeEnum } from 'src/banners/types/enums/banner.type.enum';
import { BaseFilterRequest } from 'src/commons/dtos/base-filter-request.dto';

export class BannerFindManyQueryDto extends BaseFilterRequest {
  @ApiPropertyOptional({
    examples: ['SUPERVISOR', 'MODERATOR'],
  })
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsEnum(BannerTypeEnum, {
    message: `Type must be one of ${Object.values(BannerTypeEnum).join(', ')}`,
    each: true,
  })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.toUpperCase().split(',');
    }
    return value;
  })
  type?: BannerTypeEnum[];

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
  track_id?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

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

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  current_time?: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  expired_at_lte?: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  expired_at_gte?: number;
}
