import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BannerDeleteDto } from 'src/banners/dtos/requests/banner.delete.dto';
import { BannerTypeEnum } from 'src/banners/types/enums/banner.type.enum';
import { Validate12HourTimeFormat } from 'src/tender-commons/decorators/validate-12hour-time-format.decorator';

export class BannerUpdateDto extends BannerDeleteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  track_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(BannerTypeEnum, {
    message: `Type must be one of ${Object.values(BannerTypeEnum).join(', ')}`,
  })
  type?: BannerTypeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  expired_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Validate12HourTimeFormat()
  expired_time?: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  expired_at?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  deleted_logo_urls?: string[];
}
