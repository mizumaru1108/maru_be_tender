export type OldProposalsList = {
  id: string;
  project_name: string;
  project_number: string;
  employee_name: string;
  // governorate: string;
  // client_name: string;
  // email: string;
  // number_phone: string;
  // total_proposal: number;
  // user_id: string;
};

export interface OldProposalsRow {
  row: OldProposalsList;
  selected?: boolean;
  onSelectRow?: VoidFunction;
}
