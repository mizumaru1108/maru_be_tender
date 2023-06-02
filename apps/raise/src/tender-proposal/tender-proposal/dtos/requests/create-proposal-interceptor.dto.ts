import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateProjectBudgetDto } from './create-proposal-item-budget.dto';
import { CreateProjectTimelineDto } from './create-project-timeline.dto';

export class CreateProposalInterceptorDto {
  /* first form ---------------------------------------------------- */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_idea: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_location: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_implement_date: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Execution Time must be a number!' },
  )
  @Min(1)
  @Max(999999999999)
  @IsNotEmpty()
  execution_time: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_beneficiaries: string;
  /* first form ---------------------------------------------------- */

  /* second form ---------------------------------------------------- */
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false },
    { message: 'num_ofproject_binicficiaries must be a number!' },
  )
  @Min(0.01)
  @Max(999999999999999999.99)
  @IsNotEmpty()
  num_ofproject_binicficiaries?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  project_goals?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  project_outputs?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  project_strengths?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  project_risks?: string;
  /* second form ---------------------------------------------------- */

  /* third form ---------------------------------------------------- */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  pm_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  pm_mobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  pm_email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  region?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  governorate?: string;
  /* third form ---------------------------------------------------- */

  /* fourth form ---------------------------------------------------- */
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false },
    { message: 'amount_required_fsupport must be a number!' },
  )
  @Min(0.01)
  @Max(999999999999999999.99)
  @IsNotEmpty()
  amount_required_fsupport?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateProjectBudgetDto)
  detail_project_budgets?: CreateProjectBudgetDto[];
  /* fourth form ---------------------------------------------------- */

  /* fifth form ---------------------------------------------------- */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  proposal_bank_information_id?: string;
  /* fifth form ---------------------------------------------------- */

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @IsArray()
  @Type(() => CreateProjectTimelineDto)
  project_timeline?: CreateProjectTimelineDto[];
}
