import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { CreateProposalFollowUpDto } from '../dtos/requests/create-follow-up.dto';

export const CreateFollowUpMapper = (
  currentUser: TenderCurrentUser,
  request: CreateProposalFollowUpDto,
): Prisma.proposal_follow_upUncheckedCreateInput => {
  const payload: Prisma.proposal_follow_upUncheckedCreateInput = {
    id: nanoid(),
    user_id: currentUser.id,
    proposal_id: request.proposal_id,
    submitter_role: currentUser.choosenRole,
  };

  if (request.follow_up_type === 'plain') {
    payload.content = request.content;
  }

  return payload;
};
