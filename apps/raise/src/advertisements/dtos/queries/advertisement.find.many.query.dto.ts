import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AdvertisementTypeEnum } from 'src/advertisements/types/enums/advertisement.type.enum';
import { BaseFilterRequest } from 'src/commons/dtos/base-filter-request.dto';

export class AdvertisementFindManyQueryDto extends BaseFilterRequest {
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

  @ApiPropertyOptional({
    description: 'description of the AdvertisementTypeEnum property',
    enum: AdvertisementTypeEnum,
  })
  @IsOptional()
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.toUpperCase().split(',');
    }
    return value;
  })
  @IsEnum(AdvertisementTypeEnum, {
    message: `Type must be one of ${Object.values(AdvertisementTypeEnum).join(
      ', ',
    )}`,
    each: true,
  })
  type: AdvertisementTypeEnum[];
}
