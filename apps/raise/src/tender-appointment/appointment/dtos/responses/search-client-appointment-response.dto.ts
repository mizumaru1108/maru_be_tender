import { ApiProperty } from '@nestjs/swagger';

export class SearchClientAppointmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  client_data: {
    id: string;
    entity: string | null;
  } | null;

  @ApiProperty()
  schedule: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
}
