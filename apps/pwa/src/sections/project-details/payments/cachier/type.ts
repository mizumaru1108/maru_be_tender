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

export interface UploadReceiptPayload {
  transactionReceipt: File[];
  depositDate: string;
  checkTransferNumber: string;
}
