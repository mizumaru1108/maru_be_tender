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

// create log for ceo when accept and reject proposal
export interface ceoProposalLogPayload {
  id: string; // generate by nano id
  proposal_id: string; // from the proposal it self
  reviewer_id: string; // user id of current user (moderator/ceo)
  organization_id: string; // user id on the proposal data
  inner_status: 'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION' | 'REJECTED_BY_CEO_WITH_COMMENT';
  outter_status: 'CANCELED' | 'ONGOING';
  state: 'CEO' | 'PROJECT_SUPERVISOR';
  procedures?: string;
  notes?: string;
}

export interface ceoApproveRejectVariables {
  proposalLogPayload: ceoProposalLogPayload;
  updateProposalStatusAndStatePayloads: updateProposalStatusAndState;
  proposalId: string;
}
