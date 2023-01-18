import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { ProposalCreateDto } from '../dtos/requests/proposal/proposal-create.dto';

export const CreateProposalMapper = (
  submitter_user_id: string,
  payload: ProposalCreateDto,
): Prisma.proposalUncheckedCreateInput => {
  console.log('on mapper');
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
    detail_project_budgets,
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
  createPayload.project_implement_date = new Date(project_implement_date);
  createPayload.execution_time = execution_time;
  createPayload.project_beneficiaries = project_beneficiaries;
  if (
    !!project_idea &&
    !!project_location &&
    !!project_implement_date &&
    !!execution_time &&
    !!project_beneficiaries
  ) {
    createPayload.step = 'FIRST';
  }

  /* form 2 */
  if (num_ofproject_binicficiaries) {
    createPayload.num_ofproject_binicficiaries = num_ofproject_binicficiaries;
  }
  project_goals && (createPayload.project_goals = project_goals);
  project_outputs && (createPayload.project_outputs = project_outputs);
  project_strengths && (createPayload.project_strengths = project_strengths);
  project_risks && (createPayload.project_risks = project_risks);
  if (
    !!project_idea &&
    !!project_location &&
    !!project_implement_date &&
    !!execution_time &&
    !!project_beneficiaries &&
    !!num_ofproject_binicficiaries &&
    !!project_goals &&
    !!project_outputs &&
    !!project_strengths &&
    !!project_risks
  ) {
    createPayload.step = 'SECOND';
  }

  /* form 3 */
  pm_name && (createPayload.pm_name = pm_name);
  pm_mobile && (createPayload.pm_mobile = pm_mobile);
  pm_email && (createPayload.pm_email = pm_email);
  region && (createPayload.region = region);
  governorate && (createPayload.governorate = governorate);
  if (
    !!project_idea &&
    !!project_location &&
    !!project_implement_date &&
    !!execution_time &&
    !!project_beneficiaries &&
    !!num_ofproject_binicficiaries &&
    !!project_goals &&
    !!project_outputs &&
    !!project_strengths &&
    !!project_risks &&
    !!pm_name &&
    !!pm_name &&
    !!pm_mobile &&
    !!pm_email &&
    !!region &&
    !!governorate
  ) {
    createPayload.step = 'THIRD';
  }

  /* form 4 */
  if (amount_required_fsupport) {
    createPayload.amount_required_fsupport = amount_required_fsupport;
  }
  if (
    !!project_idea &&
    !!project_location &&
    !!project_implement_date &&
    !!execution_time &&
    !!project_beneficiaries &&
    !!num_ofproject_binicficiaries &&
    !!project_goals &&
    !!project_outputs &&
    !!project_strengths &&
    !!project_risks &&
    !!pm_name &&
    !!pm_mobile &&
    !!pm_email &&
    !!region &&
    !!governorate &&
    !!amount_required_fsupport &&
    !!detail_project_budgets
  ) {
    createPayload.step = 'FOURTH';
  }

  /* form 5 */
  if (
    !!project_idea &&
    !!project_location &&
    !!project_implement_date &&
    !!execution_time &&
    !!project_beneficiaries &&
    !!num_ofproject_binicficiaries &&
    !!project_goals &&
    !!project_outputs &&
    !!project_strengths &&
    !!project_risks &&
    !!pm_name &&
    !!pm_mobile &&
    !!pm_email &&
    !!region &&
    !!governorate &&
    !!amount_required_fsupport &&
    !!detail_project_budgets &&
    !!proposal_bank_information_id
  ) {
    createPayload.step = 'ZERO';
  }

  return createPayload;
};
