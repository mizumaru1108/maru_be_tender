import { ComboBoxOption } from 'components/hook-form/RHFComboBox';
import { IGovernorate } from 'sections/admin/governorate/list/types';
import { IRegions } from 'sections/admin/region/list/types';

export type ActiveStep = 'STEP1' | 'STEP2' | 'STEP3' | 'STEP4' | 'STEP5';

export type BeneficiariesMap = {
  [key: string]: string;
};

export const project_beneficiaries_map: BeneficiariesMap = {
  KIDS: 'أطفال',
  ELDERLY: 'كبار السن',
  MIDDLE_AGED: 'منتصف العمر',
  GENERAL: 'جنرال لواء',
  MEN: 'رجال',
  WOMEN: 'النساء',
};

export const target_type_map: BeneficiariesMap = {
  YOUTHS: 'YOUTHS',
  GIRLS: 'GIRLS',
  CHILDREN: 'CHILDREN',
  FAMILY: 'FAMILY',
  PARENTS: 'PARENTS',
  MOMS: 'MOMS',
  EMPLOYEMENT: 'EMPLOYEMENT',
  PUBLIC_BENEFIT: 'PUBLIC_BENEFIT',
  CHARITABLE_ORGANIZATIONS: 'CHARITABLE_ORGANIZATIONS',
  CHARITABLE_WORKERS: 'CHARITABLE_WORKERS',
};

export const target_age_map: BeneficiariesMap = {
  AGE_1TH_TO_13TH: 'AGE_1TH_TO_13TH',
  AGE_14TH_TO_30TH: 'AGE_14TH_TO_30TH',
  AGE_31TH_TO_50TH: 'AGE_31TH_TO_50TH',
  AGE_51TH_TO_60TH: 'AGE_51TH_TO_60TH',
  AGE_OVER_60TH: 'AGE_OVER_60TH',
  ALL_AGE: 'ALL_AGE',
};

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
  payment_number?: number;
  section_id?: string;
  section_id_level_one?: string;
  section_id_level_two?: string;
  section_id_level_three?: string;
  section_id_level_four?: string;
}

export interface ProposalGovernorates {
  proposal_governorate_id?: string;
  proposal_id?: string;
  governorate_id?: string;
  created_at?: Date;
  governorate?: IGovernorate;
}

export interface ProposalRegions {
  proposal_region_id?: string;
  proposal_id?: string;
  region_id?: string;
  created_at?: Date;
  region?: IRegions;
}

export interface SupervisorStep2 {
  organizationName: string;
  region: string;
  region_id?: string;
  region_detail?: IRegions;
  governorate: string;
  governorate_id?: string;
  governorate_detail?: IGovernorate;
  date_of_esthablistmen: Date;
  chairman_of_board_of_directors: string;
  ceo: string;
  been_supported_before: boolean;
  most_clents_projects: string;
  num_of_beneficiaries: number;
  proposal_governorates?: ProposalGovernorates[];
  proposal_regions?: ProposalRegions[];
  regions_id?: ComboBoxOption[];
  governorates_id?: ComboBoxOption[];
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
  // target_group_age: number | undefined;
  target_group_age: string;
  project_implement_date: Date;
  execution_time: number;
  project_location: string;
  been_made_before: boolean;
  // remote_or_insite: boolean;
  remote_or_insite: string;
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
