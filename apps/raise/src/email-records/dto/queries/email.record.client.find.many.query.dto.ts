import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseFilterRequest } from '../../../commons/dtos/base-filter-request.dto';
import { EmailRecordIncludeRelationsTypes } from '../../repositories/email.record.repository';

export class ClientEmailRecordFindManyQueryDto extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiver_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  include_relations?: EmailRecordIncludeRelationsTypes[];
}
