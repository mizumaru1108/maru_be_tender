import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
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
import { TargetGroupAgeEnum } from '../../enums/target-group-age.enum';

export class CeoChangeStatePayload {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  step_back_to?: 'MODERATOR' | 'PROJECT_MANAGER' | 'PROJECT_SUPERVISOR';

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(999999999999999999.99)
  number_of_payments_by_supervisor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999999999999999.99)
  fsupport_by_supervisor?: number;

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

  /* exist only on CONCESSIONAL_GRANTS */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  accreditation_type_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  // @IsNotEmpty()
  chairman_of_board_of_directors?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  most_clents_projects?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  been_supported_before?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  added_value?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  reasons_to_accept?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999999999999999.99)
  target_group_num?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  target_group_type?: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsNumber({ maxDecimalPlaces: 2 })
  // @Min(0.01)
  // @Max(999999999999999999.99)
  // target_group_age?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TargetGroupAgeEnum, {
    message: `Status must be one of ${Object.values(TargetGroupAgeEnum).join(
      ', ',
    )}`,
  })
  target_group_age?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  been_made_before?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(['remote', 'insite', 'both', 'others'], {
    message: 'Activity must be remote, insite, both or others',
  })
  remote_or_insite?: 'remote' | 'insite' | 'both' | 'others';

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Type(() => CreateProjectBudgetDto)
  @ValidateNested({ each: true })
  created_recommended_support?: CreateProjectBudgetDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Type(() => ExistingProjectBudgetDto)
  @ValidateNested({ each: true })
  updated_recommended_support: ExistingProjectBudgetDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Type(() => ExistingProjectBudgetDto)
  @ValidateNested({ each: true })
  deleted_recommended_support?: ExistingProjectBudgetDto[];
}
