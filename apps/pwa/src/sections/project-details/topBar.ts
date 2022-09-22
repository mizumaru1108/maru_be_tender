export const topBar = {
  tender_client: {
    show_details: ['general', 'project-pudget'],
    completing_exchange_permission: [],
  },
  tender_moderator: {
    show_details: ['general', 'project-path', 'follow-ups'],
    completing_exchange_permission: [],
  },
  tender_project_supervisor: {
    show_details: ['general', 'project-pudget', 'project-path', 'follow-ups'],
    completing_exchange_permission: [
      'general',
      'project-pudget',
      'project-path',
      'follow-ups',
      'payments',
    ],
  },
  tender_project_manager: {
    show_details: ['general', 'project-pudget', 'project-path', 'follow-ups'],
    completing_exchange_permission: [
      'general',
      'project-pudget',
      'project-path',
      'follow-ups',
      'payments',
    ],
  },
  tender_consultant: {
    completing_exchange_permission: [],
    show_details: ['general', 'project-pudget', 'project-path', 'follow-ups'],
  },
  tender_ceo: {
    completing_exchange_permission: [],
    show_details: ['general', 'project-pudget', 'project-path', 'follow-ups'],
  },
  tender_finance: {
    show_details: [],
    completing_exchange_permission: [
      'general',
      'project-pudget',
      'project-path',
      'follow-ups',
      'payments',
      'exchange-details',
    ],
  },
  tender_cashier: {
    show_details: [],
    completing_exchange_permission: [
      'general',
      'project-pudget',
      'project-path',
      'follow-ups',
      'payments',
    ],
  },
  cluster_admin: { show_details: [], completing_exchange_permission: [] },

  tender_accounts_manager: { show_details: [], completing_exchange_permission: [] },
  tender_admin: { show_details: [], completing_exchange_permission: [] },
};
