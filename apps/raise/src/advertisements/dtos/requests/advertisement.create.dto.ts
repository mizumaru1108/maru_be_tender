import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AdvertisementTypeEnum } from 'src/advertisements/types/enums/advertisement.type.enum';
import { Validate12HourTimeFormat } from 'src/tender-commons/decorators/validate-12hour-time-format.decorator';

export class AdvertisementCreateDto {
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
    enum: AdvertisementTypeEnum,
  })
  @IsNotEmpty()
  @IsEnum(AdvertisementTypeEnum, {
    message: `Type must be one of ${Object.values(AdvertisementTypeEnum).join(
      ', ',
    )}`,
  })
  type: AdvertisementTypeEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Validate12HourTimeFormat()
  start_time: string;
}
