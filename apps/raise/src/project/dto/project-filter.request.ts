import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseBooleanString } from '../../commons/enums/base-boolean-string.enum';
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
  @IsEnum(BooleanString || BaseBooleanString)
  hasAc?: BooleanString | BaseBooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString || BaseBooleanString)
  hasClassroom?: BooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString || BaseBooleanString)
  hasGreenSpace?: BooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString || BaseBooleanString)
  hasFemaleSection?: BooleanString | BaseBooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString || BaseBooleanString)
  hasParking?: BooleanString | BaseBooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString || BaseBooleanString)
  isDeleted?: BooleanString | BaseBooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BooleanString || BaseBooleanString)
  isPublished?: BooleanString | BaseBooleanString;
}
