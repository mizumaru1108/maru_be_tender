import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReadAndDeleteMineDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(['message', 'notification'])
  @IsNotEmpty()
  type?: 'message' | 'notification';
}
