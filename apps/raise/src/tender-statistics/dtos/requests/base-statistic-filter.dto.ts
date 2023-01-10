import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsNotEmpty } from 'class-validator';
import { BaseFilterRequest } from '../../../commons/dtos/base-filter-request.dto';

export class BaseStatisticFilter extends BaseFilterRequest {
  @ApiProperty()
  @IsString()
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty()
  @IsString()
  @IsDateString()
  @IsNotEmpty()
  end_date: string;
}
