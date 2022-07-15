import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly department: string;

  @ApiProperty()
  readonly description: string;
}
