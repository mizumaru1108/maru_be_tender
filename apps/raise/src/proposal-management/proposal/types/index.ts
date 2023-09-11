import { OutterStatusEnum } from '../../../tender-commons/types/proposal';
import { ProposalSelectEnum } from '../dtos/queries/proposal.report.list.query.dto';

export interface ProposalFetchByIdProps {
  id: string;
  includes_relation?: string[];
}

export interface ProposalFindManyProps {
  partner_name?: string[];
  region_id?: string[];
  governorate_id?: string[];
  track_id?: string[];
  benificiary_id?: string[];
  submitter_user_id?: string;
  outter_status?: OutterStatusEnum[];
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: string[];
  selected_columns?: ProposalSelectEnum[];
  start_date?: Date;
  end_date?: Date;
}

export interface ProposalDeleteProps {
  id: string;
}

export class ProposalCreateProps {
  accreditation_type_id?: string | null;
  added_value?: string | null;
  amount_required_fsupport?: number | null;
  been_made_before?: boolean | null = false;
  been_supported_before?: boolean | null = false;
  beneficiary_id?: string | null;
  cashier_id?: string | null;
  chairman_of_board_of_directors?: string | null;
  clasification_field?: string | null;
  clause?: string | null;
  closing_report?: boolean | null = false;
  created_at?: Date | null = new Date();
  does_an_agreement?: boolean | null = false;
  execution_time?: number | null;
  finance_id?: string | null;
  fsupport_by_supervisor?: number | null;
  governorate?: string | null;
  governorate_id?: string | null;
  id?: string; // optional in case you want to predefine it or use the default value
  inclu_or_exclu?: boolean | null = false;
  inner_status?: string | null = 'CREATED_BY_CLIENT';
  letter_ofsupport_req: any; //Json?
  most_clents_projects?: string | null;
  need_consultant?: boolean | null;
  need_picture?: boolean | null = false;
  num_ofproject_binicficiaries?: number | null;
  number_of_payments?: number | null;
  number_of_payments_by_supervisor?: number | null;
  oid?: number | null;
  old_inner_status?: string | null;
  on_consulting?: boolean | null = false;
  on_revision?: boolean | null = false;
  outter_status?: string | null = 'ONGOING';
  partial_support_amount?: number | null;
  pm_email?: string | null;
  pm_mobile?: string | null;
  pm_name?: string | null;
  project_attachments: any; //Json?
  project_beneficiaries?: string | null;
  project_beneficiaries_specific_type?: string | null;
  project_goals?: string | null;
  project_idea?: string | null;
  project_implement_date?: Date | null;
  project_location?: string | null;
  project_manager_id?: string | null;
  project_name: string;
  project_number?: number | null;
  project_numbers1?: number | null;
  project_outputs?: string | null;
  project_risks?: string | null;
  project_strengths?: string | null;
  project_track?: string | null; // deprecated, use track_id and refer to track entity
  proposal_bank_id?: string | null;
  reasons_to_accept?: string | null;
  region?: string | null;
  region_id?: string | null;
  remote_or_insite?: string | null;
  state?: string | null = 'MODERATOR';
  step?: string | null;
  submitter_user_id: string;
  supervisor_id?: string | null;
  support_goal_id?: string | null;
  support_outputs?: string | null;
  support_type?: boolean | null = false;
  target_group_age?: string | null;
  target_group_num?: number | null;
  target_group_type?: string | null;
  track_id?: string | null;
  updated_at?: Date | null = new Date();
  vat?: boolean | null = false;
  vat_percentage?: number | null;
  whole_budget?: number | null;
}

export class ProposalUpdateProps {
  accreditation_type_id?: string | null;
  added_value?: string | null;
  amount_required_fsupport?: number | null;
  been_made_before?: boolean | null;
  been_supported_before?: boolean | null;
  beneficiary_id?: string | null;
  cashier_id?: string | null;
  chairman_of_board_of_directors?: string | null;
  clasification_field?: string | null;
  clause?: string | null;
  closing_report?: boolean | null;
  created_at?: Date | null;
  does_an_agreement?: boolean | null;
  execution_time?: number | null;
  finance_id?: string | null;
  fsupport_by_supervisor?: number | null;
  governorate?: string | null;
  governorate_id?: string | null;
  id: string;
  inclu_or_exclu?: boolean | null;
  inner_status?: string | null;
  letter_ofsupport_req?: any; //Json?
  most_clents_projects?: string | null;
  need_consultant?: boolean | null;
  need_picture?: boolean | null;
  num_ofproject_binicficiaries?: number | null;
  number_of_payments?: number | null;
  number_of_payments_by_supervisor?: number | null;
  oid?: number | null;
  old_inner_status?: string | null;
  on_consulting?: boolean | null;
  on_revision?: boolean | null;
  outter_status?: string | null;
  partial_support_amount?: number | null;
  pm_email?: string | null;
  pm_mobile?: string | null;
  pm_name?: string | null;
  project_attachments?: any; //Json?
  project_beneficiaries?: string | null;
  project_beneficiaries_specific_type?: string | null;
  project_goals?: string | null;
  project_idea?: string | null;
  project_implement_date?: Date | null;
  project_location?: string | null;
  project_manager_id?: string | null;
  project_name?: string;
  project_number?: number | null;
  project_numbers1?: number;
  project_outputs?: string | null;
  project_risks?: string | null;
  project_strengths?: string | null;
  project_track?: string | null; // deprecated, use track_id and refer to track entity
  proposal_bank_id?: string | null;
  reasons_to_accept?: string | null;
  region?: string | null;
  region_id?: string | null;
  remote_or_insite?: string | null;
  state?: string | null;
  step?: string | null;
  submitter_user_id?: string;
  supervisor_id?: string | null;
  support_goal_id?: string | null;
  support_outputs?: string | null;
  support_type?: boolean | null;
  target_group_age?: string | null;
  target_group_num?: number | null;
  target_group_type?: string | null;
  track_id?: string | null;
  updated_at?: Date | null;
  vat?: boolean | null;
  vat_percentage?: number | null;
  whole_budget?: number | null;
}
