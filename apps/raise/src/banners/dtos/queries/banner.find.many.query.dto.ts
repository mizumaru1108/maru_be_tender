import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  include_relations?: string[];

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  expired_at?: number;
}
