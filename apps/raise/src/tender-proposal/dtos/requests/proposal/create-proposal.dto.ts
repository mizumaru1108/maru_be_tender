import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { UploadFilesJsonbDto } from '../../../../tender-commons/dto/upload-files-jsonb.dto';

export class CreateProposalFirstStepDto {
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

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => UploadFilesJsonbDto)
  @ValidateNested()
  letter_ofsupport_req: UploadFilesJsonbDto;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => UploadFilesJsonbDto)
  @ValidateNested()
  project_attachments: UploadFilesJsonbDto;
}

export class CreateProposalSecondStepDto {
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
}

export class CreateProposalThirdStepDto {
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
}

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

class CreateProposalFourthStepDto {
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

export class CreateProposalFifthStepDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  proposal_bank_information_id: string;
}

export class CreateProposalDto {
  @ApiProperty()
  @IsNotEmptyObject()
  @Type(() => CreateProposalFirstStepDto)
  @ValidateNested()
  form1: CreateProposalFirstStepDto;

  @ApiProperty()
  @IsNotEmptyObject()
  @Type(() => CreateProposalSecondStepDto)
  @ValidateNested()
  form2: CreateProposalSecondStepDto;

  @ApiProperty()
  @IsNotEmptyObject()
  @Type(() => CreateProposalThirdStepDto)
  @ValidateNested()
  form3: CreateProposalThirdStepDto;

  @ApiProperty()
  @IsNotEmptyObject()
  @Type(() => CreateProposalFourthStepDto)
  @ValidateNested()
  form4: CreateProposalFourthStepDto;

  @ApiProperty()
  @IsNotEmptyObject()
  @Type(() => CreateProposalFifthStepDto)
  @ValidateNested()
  form5: CreateProposalFifthStepDto;
}
