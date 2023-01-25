import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EditRequestByIdDto } from './edit-request-by-id.dto';

export class RejectEditRequestDto extends EditRequestByIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reject_reason: string;
}
