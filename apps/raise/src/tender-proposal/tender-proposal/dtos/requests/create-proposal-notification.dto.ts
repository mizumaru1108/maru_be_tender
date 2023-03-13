import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateProposalNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_log_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['accept', 'reject'], { message: 'action must be accept or reject' })
  action: 'accept' | 'reject';
}
