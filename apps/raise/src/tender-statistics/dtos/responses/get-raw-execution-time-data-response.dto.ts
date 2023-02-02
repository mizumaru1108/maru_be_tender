import { ApiProperty } from '@nestjs/swagger';

export class GetRawExecutionTimeDataResponseDto {
  @ApiProperty()
  project_track: string | null;

  @ApiProperty()
  execution_time: number | null;

  @ApiProperty()
  created_at: Date;
}
