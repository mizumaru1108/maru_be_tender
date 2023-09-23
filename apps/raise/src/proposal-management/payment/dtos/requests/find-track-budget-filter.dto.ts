import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindTrackBudgetFilter extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(['0', '1'])
  @IsNotEmpty()
  is_deleted?: '0' | '1';
}

export class FindBankListFilter extends BaseFilterRequest {}
