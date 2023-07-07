import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['PROPOSAL', 'MESSAGE', 'APPOINTMENT', 'ACCOUNT'], {
    message: 'Type must be either PROPOSAL, MESSAGE, APPOINTMENT or ACCOUNT',
  })
  type: 'PROPOSAL' | 'MESSAGE' | 'APPOINTMENT' | 'ACCOUNT';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  specific_type?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  proposal_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  proposal_log_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  message_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  appointment_id?: string;
}
