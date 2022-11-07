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
  transactionReceipt: { url: string; size: number | undefined; type: string };
  depositDate: string;
  checkTransferNumber: string;
}
