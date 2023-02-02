export type ActiveStep = 'STEP1' | 'STEP2' | 'STEP3' | 'STEP4' | 'STEP5';

export interface ItemBudget {
  id?: string;
  amount: number | undefined;
  explanation: string;
  clause: string;
}

export interface SupervisorStep1 {
  clause: string;
  clasification_field: string;
  support_type: string | undefined;
  closing_report: string | undefined;
  need_picture: boolean | undefined;
  does_an_agreement: boolean | undefined;
  fsupport_by_supervisor?: number | undefined;
  number_of_payments_by_supervisor?: number | undefined;
  notes: string;
  support_outputs: string;
  vat: undefined;
  vat_percentage: number | undefined;
  inclu_or_exclu: boolean | undefined;
  support_goal_id: string;
  accreditation_type_id: string;
}

export interface SupervisorStep2 {
  organizationName: string;
  region: string;
  governorate: string;
  date_of_esthablistmen: Date;
  chairman_of_board_of_directors: string;
  ceo: string;
  been_supported_before: boolean;
  most_clents_projects: string;
  num_of_beneficiaries: number;
}

export interface SupervisorStep3 {
  project_name: string;
  project_idea: string;
  project_goals: string;
  amount_required_fsupport: number;
  added_value: string;
  reasons_to_accept: string;
  project_beneficiaries: string;
  target_group_num: number | undefined;
  target_group_type: string;
  target_group_age: number | undefined;
  project_implement_date: Date;
  execution_time: number;
  project_location: string;
  been_made_before: boolean;
  remote_or_insite: boolean;
}

export interface SupervisorStep4 {
  proposal_item_budgets: ItemBudget[];
  created_proposal_budget?: ItemBudget[];
  updated_proposal_budget?: ItemBudget[];
  deleted_proposal_budget?: ItemBudget[];
}

export interface SupervisorStep5 {
  recommended_support: ItemBudget[];
  created_recommended_support?: ItemBudget[];
  updated_recommended_support?: ItemBudget[];
  deleted_recommended_support?: ItemBudget[];
}
