import { Prisma } from '@prisma/client';
import { ProposalSaveDraftDto } from '../dtos/requests/proposal/proposal-save-draft';

export const UpdateProposalMapper = (
  payload: ProposalSaveDraftDto,
): Prisma.proposalUncheckedUpdateInput => {
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

  const updatePayload: Prisma.proposalUncheckedUpdateInput = {};

  /* form 1 */
  project_name && (updatePayload.project_name = project_name);
  project_idea && (updatePayload.project_idea = project_idea);
  project_location && (updatePayload.project_location = project_location);
  if (project_implement_date) {
    updatePayload.project_implement_date = new Date(project_implement_date);
  }
  execution_time && (updatePayload.execution_time = execution_time);
  if (project_beneficiaries) {
    updatePayload.project_beneficiaries = project_beneficiaries;
  }
  if (
    !!project_name &&
    !!project_idea &&
    !!project_location &&
    !!project_implement_date &&
    !!execution_time &&
    !!project_beneficiaries
  ) {
    updatePayload.step = 'FIRST';
  }

  /* form 2 */
  if (num_ofproject_binicficiaries) {
    updatePayload.num_ofproject_binicficiaries = num_ofproject_binicficiaries;
  }
  project_goals && (updatePayload.project_goals = project_goals);
  project_outputs && (updatePayload.project_outputs = project_outputs);
  project_strengths && (updatePayload.project_strengths = project_strengths);
  project_risks && (updatePayload.project_risks = project_risks);
  if (
    !!project_name &&
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
    updatePayload.step = 'SECOND';
  }

  /* form 3 */
  pm_name && (updatePayload.pm_name = pm_name);
  pm_mobile && (updatePayload.pm_mobile = pm_mobile);
  pm_email && (updatePayload.pm_email = pm_email);
  region && (updatePayload.region = region);
  governorate && (updatePayload.governorate = governorate);
  if (
    !!project_name &&
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
    !!governorate
  ) {
    updatePayload.step = 'THIRD';
  }

  /* form 4 */
  if (amount_required_fsupport) {
    updatePayload.amount_required_fsupport = amount_required_fsupport;
  }
  if (
    !!project_name &&
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
    updatePayload.step = 'FOURTH';
  }

  /* form 5 */
  if (proposal_bank_information_id) {
    updatePayload.proposal_bank_id = proposal_bank_information_id;
  }
  if (
    !!project_name &&
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
    updatePayload.step = 'ZERO';
  }

  return updatePayload;
};
