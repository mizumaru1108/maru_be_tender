import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateProjectBudgetDto } from './create-proposal-item-budget.dto';
import { CreateProjectTimelineDto } from './create-project-timeline.dto';

export class SendRevisionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_id: string;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  project_idea?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  project_location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  project_implement_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  beneficiary_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999999999999999.99)
  @IsNotEmpty()
  @Type(() => Number)
  // @Transform(({ value }) => new Number(value))
  num_ofproject_binicficiaries?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999999999999999.99)
  @IsNotEmpty()
  @Transform(({ value }) => new Number(value))
  amount_required_fsupport?: number;

  @ApiPropertyOptional()
  @IsOptional()
  letter_ofsupport_req?: any;

  @ApiPropertyOptional()
  @IsOptional()
  project_attachments?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateProjectBudgetDto)
  detail_project_budgets?: CreateProjectBudgetDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @IsArray()
  @Type(() => CreateProjectTimelineDto)
  project_timeline?: CreateProjectTimelineDto[];
}
