import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BooleanString } from '../../commons/enums/boolean-string.enum';

export class ProjectFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxDiameterSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minDiameterSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  toiletSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  prayerMinCapacity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  prayerMaxCapacity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString)
  hasAc?: BooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString)
  hasClassroom?: BooleanString;

  @ApiPropertyOptional({ enum: BooleanString })
  @IsOptional()
  @IsEnum(BooleanString)
  hasGreenSpace?: BooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString)
  hasFemaleSection?: BooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString)
  hasParking?: BooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString)
  isDeleted?: BooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString)
  isPublished?: BooleanString;
}
