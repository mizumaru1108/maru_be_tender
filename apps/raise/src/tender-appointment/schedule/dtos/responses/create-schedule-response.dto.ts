import { ApiProperty } from '@nestjs/swagger';
import { CreateSchedulePayload } from '../requests/create-schedule-request.dto';

export class CreateScheduleResponseDto {
  @ApiProperty()
  createdSchedule: {
    day: string;
    start_time: string | null;
    end_time: string | null;
  }[];

  @ApiProperty()
  createdCount: number;
}
