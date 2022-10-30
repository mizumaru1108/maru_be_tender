import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateProposalFirstStepDto } from './update-proposal-first-step.dto';
import { UpdateProposalFourthStepDto } from './update-proposal-fourth-step.dto';
import { UpdateProposalSecondStepDto } from './update-proposal-second-step.dto';
import { UpdateProposalThirdStepDto } from './update-proposal-third-step.dto';
import { UpdateProposalFifthStepDto } from "./update-proposal-fifth-step.dto";

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
