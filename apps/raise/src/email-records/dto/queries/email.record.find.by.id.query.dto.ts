import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { EmailRecordIncludeRelationsTypes } from '../../repositories/email.record.repository';

export class EmailRecordFindByIdQueryDto {
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
