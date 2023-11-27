import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PreviousProposalFilterRequest extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.toUpperCase().split(',');
    }
    return value;
  })
  outter_status?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  project_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  client_name?: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsNotEmpty()
  // @IsString()
  // track_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  track_id?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  start_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  range_start_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  range_end_date?: Date;
}
