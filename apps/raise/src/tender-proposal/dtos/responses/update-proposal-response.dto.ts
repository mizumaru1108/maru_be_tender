import { ApiProperty } from '@nestjs/swagger';
import { proposal } from '@prisma/client';

export class UpdateProposalResponseDto {
  @ApiProperty()
  currentProposal: proposal;

  @ApiProperty()
  updatedProposal: proposal | null;

  @ApiProperty()
  details: string;
}
