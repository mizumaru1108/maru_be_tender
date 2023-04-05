import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CeoChangeStatePayload {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  step_back_to?: 'MODERATOR' | 'PROJECT_MANAGER' | 'PROJECT_SUPERVISOR';
}
