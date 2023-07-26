import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AdvertisementDeleteDto } from 'src/advertisements/dtos/requests/advertisement.delete.dto';
import { AdvertisementTypeEnum } from 'src/advertisements/types/enums/advertisement.type.enum';
import { Validate12HourTimeFormat } from 'src/tender-commons/decorators/validate-12hour-time-format.decorator';

export class AdvertisementUpdateDto extends AdvertisementDeleteDto {
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
  @IsEnum(AdvertisementTypeEnum, {
    message: `Type must be one of ${Object.values(AdvertisementTypeEnum).join(
      ', ',
    )}`,
  })
  type?: AdvertisementTypeEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Validate12HourTimeFormat()
  start_time?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  deleted_logo_urls?: string[];
}
