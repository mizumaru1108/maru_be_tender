import { FusionAuthRoles } from '../@types/commons';
import { Proposal } from '../@types/proposal';

export const CheckIsInProcessProposal = (
  proposal: Proposal,
  activeRole: FusionAuthRoles
): boolean => {
  let isInProcess = false;
  if (activeRole === 'tender_project_supervisor') {
    if (
      proposal.inner_status === 'ACCEPTED_BY_MODERATOR' &&
      !['ON_REVISION'].includes(proposal.outter_status)
    ) {
      isInProcess = true;
    }
  }
  if (activeRole === 'tender_project_manager') {
    if (
      ['REJECTED_BY_SUPERVISOR', 'ACCEPTED_BY_SUPERVISOR'].includes(proposal.inner_status) &&
      ['PENDING_CANCELED', 'ONGOING'].includes(proposal.outter_status) &&
      ['PROJECT_SUPERVISOR', 'PROJECT_MANAGER'].includes(proposal.state)
    ) {
      isInProcess = true;
    }
  }
  if (activeRole === 'tender_ceo') {
    if (['ACCEPTED_BY_CONSULTANT', 'ACCEPTED_BY_PROJECT_MANAGER'].includes(proposal.inner_status)) {
      isInProcess = true;
    }
  }
  if (activeRole === 'tender_consultant') {
    if (
      ['ACCEPTED_AND_NEED_CONSULTANT'].includes(proposal.inner_status) &&
      ['CONSULTANT'].includes(proposal.state)
    ) {
      isInProcess = true;
    }
  }
  if (activeRole === 'tender_finance') {
    if (
      ['ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR'].includes(proposal.inner_status) &&
      ['ONGOING'].includes(proposal.outter_status) &&
      proposal?.payments &&
      proposal?.payments.length > 0 &&
      proposal?.payments.some((item) =>
        ['accepted_by_project_manager', 'uploaded_by_cashier'].includes(item?.status)
      )
    ) {
      isInProcess = true;
    }
  }
  return isInProcess;
};
