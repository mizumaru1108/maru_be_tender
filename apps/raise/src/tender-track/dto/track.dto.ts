import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BaseFilterRequest } from '../../commons/dtos/base-filter-request.dto';

export class TracSectionkDto extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsUUID()
  id: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  budget: number;

  @ApiPropertyOptional()
  @IsString()
  @IsUUID()
  track_id: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsUUID()
  section_id?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_leaf?: boolean;
}
