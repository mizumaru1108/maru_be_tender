import { ApiProperty } from '@nestjs/swagger';
export interface IScheduleWithGap {
  id: string;
  day: string;
  start_time: string | null;
  end_time: string | null;
  time_gap?: string[] | [];
}
export class GetMyScheduleResponse {
  @ApiProperty()
  schedule: IScheduleWithGap[];
}
