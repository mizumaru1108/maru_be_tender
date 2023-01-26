import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
  IsIn,
} from 'class-validator';

import { UpdateProposalFourthStepDto } from './update-proposal-fourth-step.dto';
import { PartialType } from '@nestjs/swagger';
import {
  CreateProposalFifthStepDto,
  CreateProposalFirstStepDto,
  CreateProposalSecondStepDto,
  CreateProposalThirdStepDto,
} from './create-proposal.dto';

class UpdateProposalFirstStepDto extends PartialType(
  CreateProposalFirstStepDto,
) {}

export class UpdateProposalSecondStepDto extends PartialType(
  CreateProposalSecondStepDto,
) {}

export class UpdateProposalThirdStepDto extends PartialType(
  CreateProposalThirdStepDto,
) {}

export class UpdateProposalFifthStepDto extends PartialType(
  CreateProposalFifthStepDto,
) {}

export class UpdateProposalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  proposal_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => UpdateProposalFirstStepDto)
  @ValidateNested()
  form1: UpdateProposalFirstStepDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => UpdateProposalSecondStepDto)
  @ValidateNested()
  form2: UpdateProposalSecondStepDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => UpdateProposalThirdStepDto)
  @ValidateNested()
  form3: UpdateProposalThirdStepDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => UpdateProposalFourthStepDto)
  @ValidateNested()
  form4: UpdateProposalFourthStepDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => UpdateProposalFifthStepDto)
  @ValidateNested()
  form5: UpdateProposalFifthStepDto;
}
