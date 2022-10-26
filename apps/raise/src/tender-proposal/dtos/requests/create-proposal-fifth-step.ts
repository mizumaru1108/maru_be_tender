import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateProposalBankInformationDto } from './create-proposal-bank-information.dto';

// form5: {
//   proposal_bank_information_id: string // selected by the user from it's own bank account
// },

// gonna be one to many

export class CreateProposalFifthStepDto {
  @ApiProperty()
  proposal_bank_information_id: string;
}
