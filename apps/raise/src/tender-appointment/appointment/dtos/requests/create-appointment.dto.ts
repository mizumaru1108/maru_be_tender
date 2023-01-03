import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Validate12HourTimeFormat } from '../../../../tender-commons/decorators/validate-12hour-time-format.decorator';

export class CreateAppointmentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  authCode?: string;

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

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Validate12HourTimeFormat()
  end_time: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // // ex: asia/jakarta to Asia/Jakarta
  // @Transform(({ value }) => {
  //   return value
  //     .split('/')
  //     .map((v: string) => v[0].toUpperCase() + v.slice(1))
  //     .join('/');
  // })
  // @ValidateTimeZone()
  // time_zone: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // @IsEmail()
  // sender: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  client_id: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // @IsEmail()
  // receiver: string;
}
