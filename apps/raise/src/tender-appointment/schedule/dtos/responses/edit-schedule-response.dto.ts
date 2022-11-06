import { ApiProperty } from '@nestjs/swagger';
import { schedule } from '@prisma/client';

export class EditScheduleResponse {
  @ApiProperty()
  editedSchedule: schedule[] | [];
}
