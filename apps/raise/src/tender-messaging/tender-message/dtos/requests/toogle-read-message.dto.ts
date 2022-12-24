import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class ToogleReadMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  roomId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  messageId?: string;
}
