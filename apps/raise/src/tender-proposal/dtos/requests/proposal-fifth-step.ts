import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateProposalBankInformationDto } from './create-proposal-bank-information.dto';

export class CreateProposalFifthStepDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  agree_on: boolean;

  @ApiProperty()
  @Type(() => CreateProposalBankInformationDto)
  @ValidateNested({ each: true })
  proposal_bank_informations: CreateProposalBankInformationDto[];
}
