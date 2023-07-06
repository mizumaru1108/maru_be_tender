import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProposalDeleteDraftDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_id: string;
}
