import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateProjectBudgetDto } from './create-proposal-item-budget.dto';
import { ExistingProjectBudgetDto } from './existing-proposal-item-budget.dto';

export class ProjectManagerChangeStatePayload {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  inclu_or_exclu?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999999999999999.99)
  vat_percentage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  support_goal_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  vat?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  support_outputs?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(999999999999999999.99)
  number_of_payments_by_supervisor: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999999999999999.99)
  fsupport_by_supervisor: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  does_an_agreement?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  need_picture?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  closing_report?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  support_type?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  clause?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  clasification_field?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Type(() => CreateProjectBudgetDto)
  @ValidateNested({ each: true })
  created_proposal_budget?: CreateProjectBudgetDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Type(() => ExistingProjectBudgetDto)
  @ValidateNested({ each: true })
  updated_proposal_budget?: ExistingProjectBudgetDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Type(() => ExistingProjectBudgetDto)
  @ValidateNested({ each: true })
  deleted_proposal_budget?: ExistingProjectBudgetDto[];
}
