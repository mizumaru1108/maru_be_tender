import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindTrackBudgetFilter extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  id?: string;
}

export class FindBankListFilter extends BaseFilterRequest {}
