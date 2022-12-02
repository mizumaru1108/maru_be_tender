import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BatchApproveEditRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class ApproveEditRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  requestId: string;
}
