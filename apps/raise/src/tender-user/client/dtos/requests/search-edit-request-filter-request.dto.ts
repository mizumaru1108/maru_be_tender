import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';

export class SearchEditRequestFilter extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  association_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'], {
    message: 'Status should be either APPROVED, REJECTED or PENDING',
  })
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}
