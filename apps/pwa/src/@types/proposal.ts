import { AppRole, InnerStatus, OutterStatus } from './commons';

export interface Proposal {
  id: string;
  project_name: string;
  submitter_user_id: string;
  created_at: Date | string;
  updated_at: Date | string;
  project_kind_id?: string;
  project_idea?: string;
  proejct_implement_date?: Date | null;
  project_location?: string | null;
  execution_time?: string;
  project_attachments?: string | null;
  letter_ofsupport_req?: string | null;
  num_ofproject_binificiaries?: number | null;
  project_goals?: string | null;
  project_outputs?: string | null;
  project_strengths?: string | null;
  project_risks?: string | null;
  pm_name?: string | null;
  pm_email?: string | null;
  pm_mobile?: string | null;
  governorate?: string | null;
  region?: string | null;
  amount_required_fsupport?: number | null;
  need_consultant?: string | null;
  step?: string | null;
  whole_budget?: number | null;
  state: AppRole;
  inner_status: InnerStatus;
  outter_status: OutterStatus;
  previously_add_bank?: string | null;
  project_beneficiaries?: string | null;
  number_of_payments?: number | null;
  finance_id?: string | null;
  cashier_id?: string | null;
  project_manager_id?: string | null;
  supervisor_id?: string | null;
}