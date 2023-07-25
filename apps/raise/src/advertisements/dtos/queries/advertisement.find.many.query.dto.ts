import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { AdvertisementTypeEnum } from 'src/advertisements/types/enums/advertisement.type.enum';
import { BaseFilterRequest } from 'src/commons/dtos/base-filter-request.dto';

export class AdvertisementFindManyQueryDto extends BaseFilterRequest {
  @ApiPropertyOptional({
    examples: ['SUPERVISOR', 'MODERATOR'],
  })
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsEnum(AdvertisementTypeEnum, {
    message: `Type must be one of ${Object.values(AdvertisementTypeEnum).join(
      ', ',
    )}`,
    each: true,
  })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.toUpperCase().split(',');
    }
    return value;
  })
  type?: AdvertisementTypeEnum[];
}
