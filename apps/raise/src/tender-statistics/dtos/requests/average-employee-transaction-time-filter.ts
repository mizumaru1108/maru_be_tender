import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseStatisticFilter } from './base-statistic-filter.dto';

export class AverageEmployeeTransactionTimeFilter extends BaseStatisticFilter {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  employee_name?: string;
}
