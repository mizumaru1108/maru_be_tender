import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { BaseFilterRequest } from '../../../commons/dtos/base-filter-request.dto';

export class BaseStatisticFilter extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsDateString()
  @IsNotEmpty()
  start_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsDateString()
  @IsNotEmpty()
  end_date?: string;
}
