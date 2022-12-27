import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ValidateTimeZone } from '../../../../tender-commons/decorators/validate-timezone.decorator';

export class CreateAppointmentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  authCode?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  start_time: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  end_time: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  summary: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  // ex: asia/jakarta to Asia/Jakarta
  @Transform(({ value }) => {
    return value
      .split('/')
      .map((v: string) => v[0].toUpperCase() + v.slice(1))
      .join('/');
  })
  @ValidateTimeZone()
  time_zone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  sender: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  receiver: string;
}
