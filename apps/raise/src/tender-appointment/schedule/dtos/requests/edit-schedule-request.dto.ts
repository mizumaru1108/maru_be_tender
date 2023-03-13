import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateScheduleDto } from './create-schedule-request.dto';

export class EditScheduleRequestDto {
  @ApiProperty()
  @IsArray()
  @Type(() => CreateScheduleDto)
  @ValidateNested({ each: true })
  scheduleUpdateRequests: CreateScheduleDto[];
}
