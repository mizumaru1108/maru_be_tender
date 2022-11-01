import { ApiProperty } from '@nestjs/swagger';
import { proposal, proposal_log } from '@prisma/client';

export class ChangeProposalStateResponseDto {
  @ApiProperty()
  proposal: proposal | null;

  @ApiProperty()
  log: proposal_log | null;
}
