import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProposalBankInformationDto {
  @ApiProperty()
  @IsNotEmpty()
  bank_information_id: string;
}
