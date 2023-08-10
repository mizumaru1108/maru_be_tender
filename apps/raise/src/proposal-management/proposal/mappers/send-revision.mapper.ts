import { Prisma } from '@prisma/client';
import { SendRevisionDto } from '../dtos/requests/send-revision.dto';

export const SendRevisionMapper = (
  payload: SendRevisionDto,
): Prisma.proposalUncheckedUpdateInput => {
  const {
    project_idea,
    project_location,
    project_implement_date,
    beneficiary_id,
    num_ofproject_binicficiaries,
    project_goals,
    project_outputs,
    project_strengths,
    project_risks,
    amount_required_fsupport,
  } = payload;

  const updatePayload: Prisma.proposalUncheckedUpdateInput = {};

  /* form 1 */
  project_idea && (updatePayload.project_idea = project_idea);
  project_location && (updatePayload.project_location = project_location);
  if (project_implement_date) {
    updatePayload.project_implement_date = new Date(project_implement_date);
  }
  if (beneficiary_id) {
    updatePayload.beneficiary_id = beneficiary_id;
  }

  /* form 2 */
  if (num_ofproject_binicficiaries) {
    updatePayload.num_ofproject_binicficiaries = num_ofproject_binicficiaries;
  }
  project_goals && (updatePayload.project_goals = project_goals);
  project_outputs && (updatePayload.project_outputs = project_outputs);
  project_strengths && (updatePayload.project_strengths = project_strengths);
  project_risks && (updatePayload.project_risks = project_risks);

  /* form 4 */
  if (amount_required_fsupport) {
    updatePayload.amount_required_fsupport = amount_required_fsupport;
  }

  return updatePayload;
};
