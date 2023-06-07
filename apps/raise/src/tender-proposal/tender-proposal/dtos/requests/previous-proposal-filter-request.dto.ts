import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

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
}
