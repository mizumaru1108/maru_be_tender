export type HashuraRoles =
  | 'cluster_admin'
  | 'tender_accounts_manager'
  | 'tender_admin'
  | 'tender_ceo'
  | 'tender_cashier'
  | 'tender_client'
  | 'tender_consultant'
  | 'tender_finance'
  | 'tender_moderator'
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
  tender_project_manager: 'project-manager',
  tender_project_supervisor: 'project-supervisor',
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
  | 'DONE_BY_CACHIER'
  | 'ACCEPTED_BY_PROJECT_MANAGER'
  | 'PAYMENT_SPECIFICATION_BY_SUPERVISOR'
  | 'PROJECT_COMPLETED'
  | 'REJECTED_BY_PROJECT_MANAGER_WITH_COMMENT'
  | 'REVISED_BY_CLIENT';

export type OutterStatus = 'COMPLETED' | 'PENDING' | 'CANCELED' | 'ONGOING';

/* Querry types */
export interface updateProposalStatusAndState {
  inner_status: InnerStatus;
  outter_status: OutterStatus;
  state: AppRole;
}
