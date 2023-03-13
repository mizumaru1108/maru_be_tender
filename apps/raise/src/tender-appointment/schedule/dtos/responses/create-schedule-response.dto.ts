import { ApiProperty } from '@nestjs/swagger';

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
