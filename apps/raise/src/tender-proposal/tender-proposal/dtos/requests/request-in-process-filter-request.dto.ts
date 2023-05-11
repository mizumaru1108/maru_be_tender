import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';
import { IsIn, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RequestInProcessFilterRequest extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(['incoming', 'inprocess'], {
    message: 'type should be incoming / inprocess',
  })
  type?: 'incoming' | 'inprocess';
}
