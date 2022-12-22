import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';

export class FetchLastMessageByUserIdDto extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id?: string;
}
