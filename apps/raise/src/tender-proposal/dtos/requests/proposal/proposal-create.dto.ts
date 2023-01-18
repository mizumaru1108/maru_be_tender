import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { TenderFilePayload } from '../../../../tender-commons/dto/tender-file-payload.dto';

class CreateProjectBudgetDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clause: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  explanation: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  amount: number;
}

export class ProposalCreateDto {
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
  @IsString()
  @IsNotEmpty()
  execution_time: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_beneficiaries: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => TenderFilePayload)
  @ValidateNested()
  letter_ofsupport_req: TenderFilePayload;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => TenderFilePayload)
  @ValidateNested()
  project_attachments: TenderFilePayload;
  /* first form ---------------------------------------------------- */

  /* second form ---------------------------------------------------- */
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
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
  @IsString()
  @IsNotEmpty()
  amount_required_fsupport?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => CreateProjectBudgetDto)
  @ValidateNested()
  detail_project_budgets?: CreateProjectBudgetDto;
  /* fourth form ---------------------------------------------------- */

  /* fifth form ---------------------------------------------------- */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  proposal_bank_information_id?: string;
  /* fifth form ---------------------------------------------------- */
}
