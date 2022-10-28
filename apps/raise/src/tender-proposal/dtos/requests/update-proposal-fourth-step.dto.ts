import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { UpdateProjectBudgetDto } from './update-project-budget.dto';

export class UpdateProposalFourthStepDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  amount_required_fsupport?: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProjectBudgetDto)
  detail_project_budgets: UpdateProjectBudgetDto[];
}
