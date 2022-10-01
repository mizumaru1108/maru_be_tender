export type ProposalFormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
};

export interface ProposalApprovePayloadSupervisor {
  clause: string;
  clasification_field: string;
  support_type: boolean;
  closing_report: boolean;
  need_picture: boolean;
  does_an_agreement: boolean;
  support_amount: number;
  number_of_payments: number;
  procedures: string;
  notes: string;
  type_of_support: string;
}
export interface ProposalApprovePayloadSupervisor {
  procedures: string;
  notes: string;
}
