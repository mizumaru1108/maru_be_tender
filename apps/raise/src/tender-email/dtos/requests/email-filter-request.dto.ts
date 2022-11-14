import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseFilterRequest } from '../../../commons/dtos/base-filter-request.dto';

export class EmailFilterRequest extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  sender_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  receiver_id: string;
}
