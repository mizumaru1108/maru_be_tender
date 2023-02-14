import { ApiProperty } from '@nestjs/swagger';

export class AverageEmployeeResponseTime {
  @ApiProperty()
  id: string;
  @ApiProperty()
  employee_name: string;
  @ApiProperty()
  account_type: string;
  @ApiProperty()
  section: string;
  @ApiProperty()
  total_transaction: number;
  @ApiProperty()
  raw_response_time: number;
  @ApiProperty()
  response_time: string;
  @ApiProperty()
  raw_average_response_time: number;
  @ApiProperty()
  average_response_time: string;
}

export class GetAverageEmployeeResponseTime {
  @ApiProperty()
  data: AverageEmployeeResponseTime[] | [];
  @ApiProperty()
  total: number;
}
