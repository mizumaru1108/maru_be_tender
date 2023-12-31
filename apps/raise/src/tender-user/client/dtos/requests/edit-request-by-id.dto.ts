import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class EditRequestByIdDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  requestId: string;
}
