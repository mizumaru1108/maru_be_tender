import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class ProposalFindByIdQueryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({
    examples: [
      'user',
      'beneficiary_details',
      'follow_ups',
      'track',
      'proposal_item_budgets',
      'supervisor',
      'poposal_log',
      'payments',
      'bank_information',
      'project_timeline',
    ],
  })
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsIn(
    [
      'user',
      'beneficiary_details',
      'follow_ups',
      'track',
      'proposal_item_budgets',
      'supervisor',
      'poposal_log',
      'payments',
      'bank_information',
      'project_timeline',
    ],
    { each: true },
  )
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  relations?: string[];
}
