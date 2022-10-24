import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import { CreateProposalFifthStepDto } from './proposal-fifth-step';
import { CreateProposalFirstStepDto } from './proposal-first-step.dto';
import { CreateProposalFourthStepDto } from './proposal-fourth-step';
import { CreateProposalSecondStepDto } from './proposal-second-step';
import { CreateProposalThirdStepDto } from './proposal-third-step';

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
