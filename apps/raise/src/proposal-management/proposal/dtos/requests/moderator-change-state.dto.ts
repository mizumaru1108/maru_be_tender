import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ModeratorChangeStatePayload {  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  track_id: string;


  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  supervisor_id?: string;
}
