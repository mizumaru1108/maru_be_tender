import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
export class ClientEditRequestResponseDto {
  @ApiProperty()
  logs: string;
}
