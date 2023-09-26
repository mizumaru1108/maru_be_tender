import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  ProposalIncludeRelationsEnum,
  ProposalIncludeRelationsTypes,
} from '../../types';
import { Transform } from 'class-transformer';

export class ProposalFindByIdQueryRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
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
  relations?: ProposalIncludeRelationsTypes[];
}
