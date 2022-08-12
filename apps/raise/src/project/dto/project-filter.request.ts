import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BooleanString } from '../../commons/enums/boolean-string.enum';

export class ProjectFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diameterSize?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  toiletSize?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prayerMinCapacity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prayerMaxCapacity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString)
  hasAc?: BooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString)
  hasClassroom?: BooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString)
  hasGreenSpace?: BooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString)
  hasFemaleSection?: BooleanString;
}
