import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BannerTypeEnum } from 'src/banners/types/enums/banner.type.enum';
import { Validate12HourTimeFormat } from 'src/tender-commons/decorators/validate-12hour-time-format.decorator';

export class BannerCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  track_id?: string;

  @ApiProperty({
    description: 'description of the AdvertisementTypeEnum property',
    enum: BannerTypeEnum,
  })
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.toUpperCase();
    }
    return value;
  })
  @IsEnum(BannerTypeEnum, {
    message: `Type must be one of ${Object.values(BannerTypeEnum).join(', ')}`,
  })
  type: BannerTypeEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  expired_date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Validate12HourTimeFormat()
  expired_time: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  expired_at: number;
}
