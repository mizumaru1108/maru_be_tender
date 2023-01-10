import { ApiProperty } from '@nestjs/swagger';

export class GetAverageTransactionResponseDto {
  @ApiProperty()
  project_track: string;
  @ApiProperty()
  total_execution_time: number;
  @ApiProperty()
  total_execution_time_data_count: number;
  @ApiProperty()
  average: number;
  @ApiProperty()
  total_execution_last_week: number;
  @ApiProperty()
  total_execution_last_week_data_count: number;
  @ApiProperty()
  average_last_week: number;
}
