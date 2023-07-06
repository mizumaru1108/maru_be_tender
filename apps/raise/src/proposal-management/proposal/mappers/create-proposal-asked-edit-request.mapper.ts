import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { appRoleMappers } from '../../../tender-commons/types';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { AskAmandementRequestDto } from '../dtos/requests/ask-amandement-request.dto';

export const CreateProposalAskedEditRequestMapper = (
  currentUser: TenderCurrentUser,
  request: AskAmandementRequestDto,
): Prisma.proposal_asked_edit_requestUncheckedCreateInput => {
  const { notes, proposal_id } = request;
  const payload: Prisma.proposal_asked_edit_requestUncheckedCreateInput = {
    id: uuidv4(),
    notes,
    proposal_id,
    sender_id: currentUser.id,
    sender_role: appRoleMappers[currentUser.choosenRole],
  };
  return payload;
};
