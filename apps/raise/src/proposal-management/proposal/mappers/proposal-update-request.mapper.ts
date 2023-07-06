import { Prisma, proposal } from '@prisma/client';
import { SendAmandementDto } from '../dtos/requests/send-amandement.dto';
import { v4 as uuidv4 } from 'uuid';

export const ProposalUpdateRequestMapper = (
  proposal: proposal,
  reviewer_id: string,
  request: SendAmandementDto,
): Prisma.proposal_edit_requestUncheckedCreateInput => {
  const reqWithoutId: Omit<SendAmandementDto, 'id'> = request;

  const detail = Object.entries(reqWithoutId).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  delete detail.proposal_id;

  const payload: Prisma.proposal_edit_requestUncheckedCreateInput = {
    id: uuidv4(),
    detail: JSON.stringify(detail),
    user_id: proposal.submitter_user_id,
    reviewer_id,
    proposal_id: proposal.id,
  };

  return payload;
};
