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
