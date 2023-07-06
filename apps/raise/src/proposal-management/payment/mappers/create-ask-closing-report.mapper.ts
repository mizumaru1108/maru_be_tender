import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AskClosingReportDto } from '../dtos/requests';

export const CreateClosingReportMapper = (request: AskClosingReportDto) => {
  const payload: Omit<
    Prisma.proposal_closing_reportUncheckedCreateInput,
    'attachments' | 'images'
  > = {
    id: uuidv4(),
    proposal_id: request.proposal_id,
    execution_place: request.execution_place,
    gender: request.gender,
    number_of_beneficiaries: request.number_of_beneficiaries,
    number_of_staff: request.number_of_staff,
    number_of_volunteer: request.number_of_volunteer,
    project_duration: request.project_duration,
    project_repeated: request.project_repeated,
    target_beneficiaries: request.target_beneficiaries,
  };
  return payload;
};
