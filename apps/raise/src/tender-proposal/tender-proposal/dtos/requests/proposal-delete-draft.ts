import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ProposalDeleteDraftDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_id: string;
}
