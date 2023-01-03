import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Validate12HourTimeFormat } from '../../../../tender-commons/decorators/validate-12hour-time-format.decorator';
export class CreateSchedulePayload {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(
    [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    {
      message:
        'day must be a valid day of the week (ex: Monday, Tuesday, etc.)',
    },
  )
  day: string;

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
}
export class CreateScheduleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSchedulePayload)
  payload: CreateSchedulePayload[];
}
