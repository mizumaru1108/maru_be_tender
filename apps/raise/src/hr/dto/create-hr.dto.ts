import { ApiProperty } from '@nestjs/swagger';

export class CreateHrDto {
  @ApiProperty()
  readonly hrName: string;
}
