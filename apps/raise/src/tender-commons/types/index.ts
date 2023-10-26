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
  | 'tender_project_supervisor'
  | 'tender_auditor_report';

export enum TenderFusionAuthRolesEnum {
  CLUSTER_ADMIN = 'cluster_admin',
  TENDER_ACCOUNTS_MANAGER = 'tender_accounts_manager',
  TENDER_ADMIN = 'tender_admin',
  TENDER_CEO = 'tender_ceo',
  TENDER_CASHIER = 'tender_cashier',
  TENDER_CLIENT = 'tender_client',
  TENDER_CONSULTANT = 'tender_consultant',
  TENDER_FINANCE = 'tender_finance',
  TENDER_MODERATOR = 'tender_moderator',
  TENDER_PROJECT_MANAGER = 'tender_project_manager',
  TENDER_PROJECT_SUPERVISOR = 'tender_project_supervisor',
  TENDER_AUDITOR_REPORT = 'tender_auditor_report',
}

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
  | 'project_supervisor'
  | 'auditor_report';

export enum TenderAppRolesEnum {
  ACCOUNTS_MANAGER = 'accounts_manager',
  ADMIN = 'admin',
  CEO = 'ceo',
  CASHIER = 'cashier',
  CLIENT = 'client',
  CONSULTANT = 'consultant',
  FINANCE = 'finance',
  MODERATOR = 'moderator',
  PROJECT_MANAGER = 'project_manager',
  PROJECT_SUPERVISOR = 'project_supervisor',
  AUDITOR_REPORT = 'auditor_report',
}

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
  | 'PROJECT_SUPERVISOR'
  | 'AUDITOR_REPORT';

export enum TenderAppRoleEnum {
  ACCOUNTS_MANAGER = 'ACCOUNTS_MANAGER',
  ADMIN = 'ADMIN',
  CEO = 'CEO',
  CASHIER = 'CASHIER',
  CLIENT = 'CLIENT',
  CONSULTANT = 'CONSULTANT',
  FINANCE = 'FINANCE',
  MODERATOR = 'MODERATOR',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  PROJECT_SUPERVISOR = 'PROJECT_SUPERVISOR',
  AUDITOR_REPORT = 'AUDITOR_REPORT',
}

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
  tender_auditor_report: 'auditor-report',
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
  tender_auditor_report: 'AUDITOR_REPORT',
};

export const appRoleToFusionAuthRoles = {
  ACCOUNTS_MANAGER: 'tender_accounts_manager',
  ADMIN: 'tender_admin',
  CEO: 'tender_ceo',
  CASHIER: 'tender_cashier',
  CLIENT: 'tender_client',
  CONSULTANT: 'tender_consultant',
  FINANCE: 'tender_finance',
  MODERATOR: 'tender_moderator',
  PROJECT_MANAGER: 'tender_project_manager',
  PROJECT_SUPERVISOR: 'tender_project_supervisor',
  AUDITOR_REPORT: 'tender_auditor_report',
};

export const appRoleToReadable = {
  ACCOUNTS_MANAGER: 'Account Manager',
  ADMIN: 'Admin',
  CEO: 'Ceo',
  CASHIER: 'Cashier',
  CLIENT: 'Client',
  CONSULTANT: 'Consultant',
  FINANCE: 'Finance',
  MODERATOR: 'Moderator',
  PROJECT_MANAGER: 'Project Manager',
  PROJECT_SUPERVISOR: 'Project Supervisor',
  AUDITOR_REPORT: 'Auditor Report',
};
