import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';

export class SearchSpecificClientProposalFilter extends BaseFilterRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  user_id: string;
}
