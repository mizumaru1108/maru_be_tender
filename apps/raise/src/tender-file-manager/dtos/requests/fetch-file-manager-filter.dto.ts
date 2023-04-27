import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterRequest } from '../../../commons/dtos/base-filter-request.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FetchFileManagerFilter extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  file_name: string;
}
