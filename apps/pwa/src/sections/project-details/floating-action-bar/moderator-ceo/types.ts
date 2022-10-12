import { updateProposalStatusAndState } from '../../../../@types/commons';

export type ProposalFormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
};

export interface ProposalRejectPayload {
  procedures: string;
}

export interface ProposalApprovePayload extends ProposalRejectPayload {
  supportOutputs: string;
}

export interface ModeratoeCeoFloatingActionBarProps {
  organizationId: string;
}

// create log for ceo and moderator when accept and reject proposal
export interface ceoAndModeratorProposalLogPayload {
  id: string; // generate by nano id
  proposal_id: string; // from the proposal it self
  reviewer_id: string; // user id of current user (moderator/ceo)
  organization_id: string; // user id on the proposal data
  inner_status: 'REJECTED_BY_CEO_WITH_COMMENT' | 'REJECTED_BY_MODERATOR_WITH_COMMENT';
  outter_status: 'CANCELED' | 'ONGOING';
  state: 'CEO' | 'MODERATOR' | 'PROJECT_SUPERVISOR';
  procedures?: string;
  notes?: string;
}

export interface ceoAndModeratorRejectProposalWLogVariables {
  proposalLogPayload: ceoAndModeratorProposalLogPayload;
  rejectProposalPayloads: updateProposalStatusAndState;
  proposalId: string;
}

export interface ceoAndModeratorApproveProposalWLogVariables {
  proposalLogPayload: ceoAndModeratorProposalLogPayload;
  acceptProposalPayloads: updateProposalStatusAndState;
  proposalId: string;
}
