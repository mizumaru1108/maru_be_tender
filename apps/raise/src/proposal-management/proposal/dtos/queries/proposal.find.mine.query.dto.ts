import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';
import {
  ProposalIncludeRelationsEnum,
  ProposalIncludeRelationsTypes,
} from '../../types';

export class ProposalFindMineQueryDto extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsEnum(ProposalIncludeRelationsEnum, {
    message: `relations must be one of ${Object.values(
      ProposalIncludeRelationsEnum,
    ).join(', ')}`,
  })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  include_relations?: ProposalIncludeRelationsTypes[];
}
