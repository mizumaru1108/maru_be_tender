import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateProjectBudgetDto } from './update-project-budget.dto';

export class UpdateProposalDraftFourthStepDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_id: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  amount_required_fsupport?: number;

  @ApiProperty()
  @Type(() => UpdateProjectBudgetDto)
  @ValidateNested({ each: true })
  detail_project_budgets: UpdateProjectBudgetDto[];
}
