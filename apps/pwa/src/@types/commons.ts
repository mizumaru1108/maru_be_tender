import { Proposal } from './proposal';

export type FusionAuthRoles =
  | 'cluster_admin'
  | 'tender_accounts_manager'
  | 'tender_admin'
  | 'tender_ceo'
  | 'tender_cashier'
  | 'tender_client'
  | 'tender_consultant'
  | 'tender_finance'
  | 'tender_moderator'
  | 'tender_auditor_report'
  | 'tender_project_manager'
  | 'tender_project_supervisor';

export type AppRoles =
  | 'accounts_manager'
  | 'admin'
  | 'ceo'
  | 'cashier'
  | 'client'
  | 'consultant'
  | 'finance'
  | 'moderator'
  | 'auditor_report'
  | 'project_manager'
  | 'project_supervisor';

export type AppRole =
  | 'ACCOUNTS_MANAGER'
  | 'ADMIN'
  | 'CEO'
  | 'CASHIER'
  | 'CLIENT'
  | 'CONSULTANT'
  | 'FINANCE'
  | 'MODERATOR'
  | 'AUDITOR_REPORT'
  | 'PROJECT_MANAGER'
  | 'PROJECT_SUPERVISOR';

export const role_url_map = {
  cluster_admin: '',
  tender_accounts_manager: 'accounts-manager',
  tender_admin: 'admin',
  tender_ceo: 'ceo',
  tender_cashier: 'cashier',
  tender_client: 'client',
  tender_consultant: 'consultant',
  tender_finance: 'finance',
  tender_moderator: 'moderator',
  tender_auditor_report: 'auditor-report',
  tender_project_manager: 'project-manager',
  tender_project_supervisor: 'project-supervisor',
};

export const submitterRoles = {
  cluster_admin: '',
  tender_accounts_manager: 'ACCOUNT_MANAGER',
  tender_admin: 'ADMIN',
  tender_ceo: 'CEO',
  tender_cashier: 'CASHIER',
  tender_client: 'CLIENT',
  tender_consultant: 'CONSULTANT',
  tender_finance: 'FINANCE',
  tender_moderator: 'MODERATOR',
  tender_auditor_report: 'AUDITOR_REPORT',
  tender_project_manager: 'PROJECT_MANAGER',
  tender_project_supervisor: 'PROJECT_SUPERVISOR',
};

/* Pagination */
export interface BasePaginateQuery {
  page?: number;
  limit?: number;
}
export interface BasePaginateResponse {
  data?: any[];
  total?: number;
  page?: number;
  limit?: number;
}

/* Graph QL Querries Related */
export type InnerStatus =
  | 'ACCEPTED_BY_MODERATOR'
  | 'CREATED_BY_CLIENT'
  | 'ASKING_MODERATOR_CHANGES'
  | 'ASKING_CLIENT_CHANGES'
  | 'REJECTED_BY_MODERATOR'
  | 'REVISED_BY_PROJECT_MANAGER'
  | 'INCORRECT_PAYMENT_DETAIL'
  | 'PAYMENT_DETAIL_REVISIED_BY_SUPERVISOR'
  | 'REJECTED_BY_SUPERVISOR_WITH_COMMENT'
  | 'ACCEPTED_BY_SUPERVISOR'
  | 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR'
  | 'NEED_REPORT_BY_CLIENT'
  | 'CLIENT_UPLOAD_REPORT'
  | 'ASKING_SUPERVISOR_CHANGES'
  | 'ACCEPTED_AND_NEED_CONSULTANT'
  | 'REJECTED_BY_CONSULTANT'
  | 'ACCEPTED_BY_CONSULTANT'
  | 'ASKING_PROJECT_MANAGER_CHANGES'
  | 'REJECTED_BY_CEO_WITH_COMMENT'
  | 'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION'
  | 'ACCEPTED_BY_FOR_PAYMENT_SPESIFICATION'
  | 'ASKING_PROJECT_SUPERVISOR_CHANGES'
  | 'ACCEPTED_BY_FINACE'
  | 'DONE_BY_CASHIER'
  | 'ACCEPTED_BY_PROJECT_MANAGER'
  | 'PAYMENT_SPECIFICATION_BY_SUPERVISOR'
  | 'PROJECT_COMPLETED'
  | 'REJECTED_BY_PROJECT_MANAGER_WITH_COMMENT'
  | 'REVISED_BY_CLIENT'
  | 'REQUESTING_CLOSING_FORM';

export type OutterStatus =
  | 'COMPLETED'
  | 'PENDING'
  | 'CANCELED'
  | 'ONGOING'
  | 'ON_REVISION'
  | 'ASKED_FOR_AMANDEMENT'
  | 'ASKED_FOR_AMANDEMENT_PAYMENT'
  | 'PENDING_CANCELED';

/* Querry types */
export interface updateProposalStatusAndState {
  inner_status: InnerStatus;
  outter_status: OutterStatus;
  state: AppRole;
}

// for upload one file
export interface UploadFilesJsonbDto {
  url?: string | '' | null;
  size?: number | undefined;
  type?: string;
  base64Data?: string;
  fullName?: string;
  fileExtension?: string;
  color?: string;
}

//for bank information
export interface bank_information {
  id: string;
  user_id: string;
  bank_account_name: string | null;
  bank_account_number: string | null;
  bank_name: string | null;
  proposal_id: string | null;
  card_image: UploadFilesJsonbDto | null;
  is_deleted: boolean | null;
  color?: string | '';
}

export interface UpdateTrackProps {
  id: string;
  name: string;
  with_consultation: boolean;
  is_deleted: boolean;
}

export interface TrackSection {
  id?: string;
  track_id?: string;
  name?: string;
  total_budget?: number;
  budget?: number;
  child_track_section?: TrackSection[];
  parent_section_id?: string;
  is_deleted?: boolean;
  section_spending_budget?: number;
  section_reserved_budget?: number;
  section_spending_budget_by_ceo?: number;
}

export interface TrackProps {
  id: string;
  name: string;
  with_consultation: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  total_budget?: number;
  budget?: number;
  proposal?: Proposal[];
  total_spending_budget?: number;
  total_reserved_budget?: number;
  total_spending_budget_by_ceo?: number;
  total_remaining_budget?: number;
  sections?: TrackSection[];
}

export type AdmissionProps = {
  proposal_config_id?: string;
  applying_status: boolean;
  starting_date: string;
  ending_date: string;
  number_of_allowing_projects: number;
  hieght_project_budget: number;
  number_of_days_to_meet_business: number;
  indicator_of_project_duration_days: number;
};

export interface BankReduxProps {
  id: string;
  bank_name: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}
export interface AuthorityReduxProps {
  authority_id: string;
  name: string;
  is_deleted: boolean;
  client_field_id: string;
}
export interface ClientFieldReduxProps {
  client_field_id: string;
  name: string;
  is_deleted: boolean;
}
