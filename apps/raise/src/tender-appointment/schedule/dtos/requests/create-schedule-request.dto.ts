import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // @IsUUID()
  // user_id: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // day: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  start_time?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  end_time?: string;
}
