import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseFilterRequest } from '../../commons/dtos/base-filter-request.dto';
import { OperatorSortByEnum } from '../enums/operator-sort-by.enum';

export class OperatorFilterRequest extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(OperatorSortByEnum)
  sortBy?: OperatorSortByEnum;
}
