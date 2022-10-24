import { proposal_item_budget } from '@prisma/client';

export class UpdateProposalFourthStepResponseDto {
  created: proposal_item_budget[] | null;
  updated: proposal_item_budget[] | null;
  deleted: string[] | null;
}
