import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ModeratorChangeStatePayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_track: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  supervisor_id?: string;
}
