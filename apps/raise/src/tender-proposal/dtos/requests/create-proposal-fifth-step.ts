import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

// form5: {
//   proposal_bank_information_id: string // selected by the user from it's own bank account
// },

//process, get the bank account id from the user, then it should be referenced in the proposal

export class CreateProposalFifthStepDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  proposal_bank_information_id: string;
}
