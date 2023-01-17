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
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  num_ofproject_binicficiaries: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_goals: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_outputs: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_strengths: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_risks: string;
  /* second form ---------------------------------------------------- */

  /* third form ---------------------------------------------------- */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pm_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pm_mobile: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pm_email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  governorate: string;
  /* third form ---------------------------------------------------- */

  /* fourth form ---------------------------------------------------- */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  amount_required_fsupport: string;

  @ApiProperty()
  @IsNotEmptyObject()
  @Type(() => CreateProjectBudgetDto)
  @ValidateNested()
  detail_project_budgets: CreateProjectBudgetDto;
  /* fourth form ---------------------------------------------------- */

  /* fifth form ---------------------------------------------------- */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  proposal_bank_information_id: string;
  /* fifth form ---------------------------------------------------- */
}
