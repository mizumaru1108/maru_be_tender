export type TenderFusionAuthRoles =
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

export type TenderAppRoles =
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

export type TenderAppRole =
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

export const appRolesMappers = {
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

export const appRoleMappers = {
  cluster_admin: '',
  tender_accounts_manager: 'ACCOUNTS_MANAGER',
  tender_admin: 'ADMIN',
  tender_ceo: 'CEO',
  tender_cashier: 'CASHIER',
  tender_client: 'CLIENT',
  tender_consultant: 'CONSULTANT',
  tender_finance: 'FINANCE',
  tender_moderator: 'MODERATOR',
  tender_project_manager: 'PROJECT_MANAGER',
  tender_project_supervisor: 'PROJECT_SUPERVISOR',
};
