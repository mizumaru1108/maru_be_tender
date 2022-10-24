import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { CreateProjectBudgetDto } from './create-project-budget.dto';

export class CreateProposalFourthStepDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  amount_required_fsupport: string;

  @ApiProperty()
  @IsNotEmptyObject()
  @Type(() => CreateProjectBudgetDto)
  @ValidateNested()
  detail_project_budgets: CreateProjectBudgetDto;
}
