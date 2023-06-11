export type ProposalFormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
};

// export interface ProposalApprovePayloadSupervisor {
//   clause: string;
//   clasification_field: string;
//   support_type: boolean;
//   closing_report: boolean;
//   need_picture: boolean;
//   does_an_agreement: boolean;
//   support_amount: number;
//   number_of_payments: number;
//   notes: string;
//   type_of_support: string;
// }
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
  vat: boolean;
  vat_percentage: number;
  inclu_or_exclu: boolean;
  support_goals: string;
  payment_number?: number;
  detail_project_budgets: {
    clause: string;
    explanation: string;
    amount: number;
  }[];
}
