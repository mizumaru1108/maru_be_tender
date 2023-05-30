import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectTimelineDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  id?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  start_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  end_date: Date;
}
