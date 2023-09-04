import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ClientFieldAndIdQueryDto extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  user_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  client_name?: string;
}
