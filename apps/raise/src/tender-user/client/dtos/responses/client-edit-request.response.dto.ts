import { ApiProperty } from '@nestjs/swagger';
import { edit_request } from '@prisma/client';

export class ClientEditRequestResponseDto {
  @ApiProperty()
  detail: string;

  @ApiProperty()
  createdEditRequest: edit_request[] | [];
}
