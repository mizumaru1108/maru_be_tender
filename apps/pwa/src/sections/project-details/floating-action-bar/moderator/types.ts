export type ProposalFormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
};

export interface ProposalRejectPayload {
  procedures: string;
}

export interface ProposalApprovePayload extends ProposalRejectPayload {
  supportOutputs: string;
  path: string;
  supervisors: string;
}

export interface ProposalModeratorApprovePayload {
  path: string;
  supervisors: string;
}
