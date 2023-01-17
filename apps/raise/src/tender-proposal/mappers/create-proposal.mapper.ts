import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { ProposalCreateDto } from '../dtos/requests/proposal/proposal-create.dto';

export const CreateProposalMapper = (
  submitter_user_id: string,
  payload: ProposalCreateDto,
): Prisma.proposalUncheckedCreateInput => {
  const {
    /* from (step 1) */
    project_name,
    project_idea,
    project_location,
    project_implement_date,
    execution_time,
    project_beneficiaries,
    // letter_ofsupport_req // will handled from service (files)
    // project_attachments // will handled from service (files)
    /* from (step 2) */
    num_ofproject_binicficiaries,
    project_goals,
    project_outputs,
    project_strengths,
    project_risks,
    /* from (step 3) */
    pm_name,
    pm_mobile,
    pm_email,
    region,
    governorate,
    /* from (step 4) */
    amount_required_fsupport,
    /* from (step 5) */
    proposal_bank_information_id,
  } = payload;

  const createPayload: Prisma.proposalUncheckedCreateInput = {
    id: nanoid(),
    project_name,
    submitter_user_id,
  };

  /* form 1 */
  createPayload.project_idea = project_idea;
  createPayload.project_location = project_location;
  createPayload.project_implement_date = project_implement_date;
  createPayload.execution_time = execution_time;
  createPayload.project_beneficiaries = project_beneficiaries;

  /* form 2 */
  createPayload.num_ofproject_binicficiaries = num_ofproject_binicficiaries;
  createPayload.project_goals = project_goals;
  createPayload.project_outputs = project_outputs;
  createPayload.project_strengths = project_strengths;
  createPayload.project_risks = project_risks;

  /* form 3 */
  createPayload.pm_name = pm_name;
  createPayload.pm_mobile = pm_mobile;
  createPayload.pm_email = pm_email;
  createPayload.region = region;
  createPayload.governorate = governorate;

  /* form 4 */
  createPayload.amount_required_fsupport = amount_required_fsupport;

  /* form 5 */
  createPayload.proposal_bank_id = proposal_bank_information_id;

  return createPayload;
};
