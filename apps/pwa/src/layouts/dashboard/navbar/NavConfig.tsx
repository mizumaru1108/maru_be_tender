// routes
import {
  PATH_CLIENT,
  PATH_CONSULTANT,
  PATH_FINANCE,
  PATH_CASHIER,
  PATH_CEO,
  PATH_PROJECT_MANAGER,
  PATH_PROJECT_SUPERVISOR,
  PATH_ACCOUNTS_MANAGER,
  PATH_MODERATOR,
} from '../../../routes/paths';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

/**
 * navConfig looks like this
 * {
 *  role : must be included[client, admin, CTO, .... etc]
 * }
 *  And inside everyone of those roles we have array of items, which the one of them includes
 *  1- title: the translation key in the i18n files.
 *  2- path: which goes the Paths file.
 *  3- icone: the Icone for this tap/button.
 *
 *  In the conclusion, when ever you want to add a new route just follow these steps :
 *  1- alter the route file.
 *  2- alter the pathes file.
 *  3- alter this file if it needs.
 *
 *  You may go through another situation, so it depends on the situation itself.
 */

const getIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/dashboard-navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  tender_client: {
    main: getIcon('main'),
    project_fund_request: getIcon('request-for-project'),
    drafts: getIcon('draft-request'),
    previous_funding_requests: getIcon('previous-request'),
    messages: getIcon('message-bar'),
    support: getIcon('contact-us'),
  },
  tender_consultant: {
    main: getIcon('main'),
    incoming_funding_requests: getIcon('incoming-funding-requests'),
    portal_reports: getIcon('portal-reports'),
    messages: getIcon('message-bar'),
  },
  tender_finance: {
    main: getIcon('main'),
    incoming_exchange_permission_requests: getIcon('incoming-exchange-permission-requests'),
    requests_in_process: getIcon('requests-in-process'),
    portal_reports: getIcon('portal-reports'),
    messages: getIcon('message-bar'),
  },
  tender_cashier: {
    main: getIcon('main'),
    Incoming_exchange_permission_requests: getIcon('incoming-exchange-permission-requests'),
    requests_in_process: getIcon('requests-in-process'),
    portal_reports: getIcon('portal-reports'),
    messages: getIcon('message-bar'),
  },
  tender_ceo: {
    main: getIcon('main'),
    project_management: getIcon('project_management'),
    rejection_list: getIcon('rejection_list'),
    portal_reports: getIcon('portal_reports'),
    messages: getIcon('message-bar'),
  },
  tender_project_manager: {
    main: getIcon('main'),
    incoming_funding_requests: getIcon('incoming-funding-requests'),
    requests_in_process: getIcon('requests-in-process'),
    previous_funding_requests: getIcon('previous-funding-requests'),
    exchange_permission: getIcon('payment-adjustment'),
    portal_reports: getIcon('portal-reports'),
    messages: getIcon('message-bar'),
    appointments_with_partners: getIcon('appointments-with-partners'),
  },
  tender_project_supervisor: {
    main: getIcon('main'),
    incoming_funding_requests: getIcon('incoming-funding-requests-project-supervisor'),
    requests_in_process: getIcon('requests-in-process'),
    previous_funding_requests: getIcon('previous-funding-requests'),
    payment_adjustment: getIcon('payment-adjustment'),
    portal_reports: getIcon('portal-reports'),
    messages: getIcon('message-bar'),
  },
  tender_moderator: {
    main: getIcon('main'),
    incoming_support_requests: getIcon('previous-request'),
    previous_support_requests: getIcon('draft-request'),
    portal_reports: getIcon('request-for-project'),
    messages: getIcon('message-bar'),
  },
  tender_accounts_manager: {
    main: getIcon('main'),
    newJoinRequest: getIcon('previous-request'),
    infoUpdateRequest: getIcon('draft-request'),
    partnerManagement: getIcon('draft-request'),
    portal_reports: getIcon('portal_reports'),
    messages: getIcon('message-bar'),
  },
};

const navConfig = {
  tender_client: [
    {
      subheader: '',
      items: [
        {
          title: 'main',
          path: PATH_CLIENT.app,
          icon: ICONS.tender_client.main,
        },
        {
          title: 'request_project_funding',
          path: PATH_CLIENT.funding_project_request,
          icon: ICONS.tender_client.project_fund_request,
        },

        {
          title: 'drafts',
          path: PATH_CLIENT.drafts,
          icon: ICONS.tender_client.drafts,
        },
        {
          title: 'previous_funding_requests',
          path: PATH_CLIENT.previous_funding_requests,
          icon: ICONS.tender_client.previous_funding_requests,
        },
        {
          title: 'messages',
          path: PATH_CLIENT.messages,
          icon: ICONS.tender_client.messages,
        },
        {
          title: 'contact_support',
          path: PATH_CLIENT.contact_support,
          icon: ICONS.tender_client.support,
        },
      ],
    },
  ],
  tender_consultant: [
    {
      subheader: '',
      items: [
        {
          title: 'main',
          path: PATH_CONSULTANT.app,
          icon: ICONS.tender_consultant.main,
        },
        {
          title: 'incoming_funding_requests',
          path: PATH_CONSULTANT.incoming_funding_requests,
          icon: ICONS.tender_consultant.incoming_funding_requests,
        },

        {
          title: 'portal_reports',
          path: PATH_CONSULTANT.portal_reports,
          icon: ICONS.tender_consultant.portal_reports,
        },
        {
          title: 'messages',
          path: PATH_CONSULTANT.messages,
          icon: ICONS.tender_consultant.messages,
        },
      ],
    },
  ],
  tender_finance: [
    {
      subheader: '',
      items: [
        {
          title: 'main',
          path: PATH_FINANCE.app,
          icon: ICONS.tender_finance.main,
        },
        {
          title: 'incoming_exchange_permission_requests',
          path: PATH_FINANCE.incoming_exchange_permission_requests,
          icon: ICONS.tender_finance.incoming_exchange_permission_requests,
        },
        {
          title: 'requests_in_process',
          path: PATH_FINANCE.requests_in_process,
          icon: ICONS.tender_finance.requests_in_process,
        },
        {
          title: 'portal_reports',
          path: PATH_FINANCE.portal_reports,
          icon: ICONS.tender_finance.portal_reports,
        },
        {
          title: 'messages',
          path: PATH_FINANCE.messages,
          icon: ICONS.tender_finance.messages,
        },
      ],
    },
  ],
  tender_cashier: [
    {
      subheader: '',
      items: [
        {
          title: 'main',
          path: PATH_CASHIER.app,
          icon: ICONS.tender_cashier.main,
        },
        {
          title: 'incoming_exchange_permission_requests',
          path: PATH_CASHIER.incoming_exchange_permission_requests,
          icon: ICONS.tender_cashier.Incoming_exchange_permission_requests,
        },
        {
          title: 'requests_in_process',
          path: PATH_CASHIER.requests_in_process,
          icon: ICONS.tender_cashier.requests_in_process,
        },
        {
          title: 'portal_reports',
          path: PATH_CASHIER.portal_reports,
          icon: ICONS.tender_cashier.portal_reports,
        },
        {
          title: 'messages',
          path: PATH_CASHIER.messages,
          icon: ICONS.tender_cashier.messages,
        },
      ],
    },
  ],
  tender_ceo: [
    {
      subheader: '',
      items: [
        {
          title: 'main',
          path: PATH_CEO.app,
          icon: ICONS.tender_ceo.main,
        },
        {
          title: 'Incoming_exchange_permission_requests',
          path: PATH_CEO.project_management,
          icon: ICONS.tender_ceo.project_management,
        },
        {
          title: 'requests_in_process',
          path: PATH_CEO.rejection_list,
          icon: ICONS.tender_ceo.rejection_list,
        },
        {
          title: 'portal_reports',
          path: PATH_CEO.portal_reports,
          icon: ICONS.tender_ceo.portal_reports,
        },
        {
          title: 'messages',
          path: PATH_CEO.messages,
          icon: ICONS.tender_ceo.messages,
        },
      ],
    },
  ],
  tender_project_manager: [
    {
      subheader: '',
      items: [
        {
          title: 'main',
          path: PATH_PROJECT_MANAGER.app,
          icon: ICONS.tender_project_manager.main,
        },
        {
          title: 'incoming_funding_requests',
          path: PATH_PROJECT_MANAGER.incoming_funding_requests,
          icon: ICONS.tender_project_manager.incoming_funding_requests,
        },
        {
          title: 'requests_in_process',
          path: PATH_PROJECT_MANAGER.requests_in_process,
          icon: ICONS.tender_project_manager.requests_in_process,
        },
        {
          title: 'previous_funding_requests',
          path: PATH_PROJECT_MANAGER.previous_funding_requests,
          icon: ICONS.tender_project_manager.previous_funding_requests,
        },
        {
          title: 'exchange_permission',
          path: PATH_PROJECT_MANAGER.exchange_permission,
          icon: ICONS.tender_project_manager.exchange_permission,
        },
        {
          title: 'portal_reports',
          path: PATH_PROJECT_MANAGER.portal_reports,
          icon: ICONS.tender_project_manager.portal_reports,
        },
        {
          title: 'messages',
          path: PATH_PROJECT_MANAGER.messages,
          icon: ICONS.tender_project_manager.messages,
        },
        {
          title: 'appointments_with_partners',
          path: PATH_PROJECT_MANAGER.appointments_with_partners,
          icon: ICONS.tender_project_manager.appointments_with_partners,
        },
      ],
    },
  ],
  tender_project_supervisor: [
    {
      subheader: '',
      items: [
        {
          title: 'main',
          path: PATH_PROJECT_SUPERVISOR.app,
          icon: ICONS.tender_project_supervisor.main,
        },
        {
          title: 'incoming_funding_requests_project_supervisor',
          path: PATH_PROJECT_SUPERVISOR.incoming_funding_requests,
          icon: ICONS.tender_project_supervisor.incoming_funding_requests,
        },
        {
          title: 'requests_in_process',
          path: PATH_PROJECT_SUPERVISOR.requests_in_process,
          icon: ICONS.tender_project_supervisor.requests_in_process,
        },
        {
          title: 'previous_funding_requests',
          path: PATH_PROJECT_SUPERVISOR.previous_funding_requests,
          icon: ICONS.tender_project_supervisor.previous_funding_requests,
        },
        {
          title: 'payment_adjustment',
          path: PATH_PROJECT_SUPERVISOR.payment_adjustment,
          icon: ICONS.tender_project_supervisor.payment_adjustment,
        },
        {
          title: 'portal_reports',
          path: PATH_PROJECT_SUPERVISOR.portal_reports,
          icon: ICONS.tender_project_supervisor.portal_reports,
        },
        {
          title: 'messages',
          path: PATH_PROJECT_SUPERVISOR.messages,
          icon: ICONS.tender_project_supervisor.messages,
        },
      ],
    },
  ],
  tender_accounts_manager: [
    {
      subheader: '',
      items: [
        {
          title: 'main',
          path: PATH_ACCOUNTS_MANAGER.app,
          icon: ICONS.tender_accounts_manager.main,
        },
        {
          title: 'new_join_request',
          path: PATH_ACCOUNTS_MANAGER.newJoinRequest,
          icon: ICONS.tender_accounts_manager.newJoinRequest,
        },

        {
          title: 'information_update_request',
          path: PATH_ACCOUNTS_MANAGER.infoUpdateRequest,
          icon: ICONS.tender_accounts_manager.infoUpdateRequest,
        },
        {
          title: 'partner_management',
          path: PATH_ACCOUNTS_MANAGER.partnerManagement,
          icon: ICONS.tender_accounts_manager.partnerManagement,
        },
        {
          title: 'portal_reports',
          path: PATH_ACCOUNTS_MANAGER.portalReports,
          icon: ICONS.tender_accounts_manager.portal_reports,
        },
        {
          title: 'messages',
          path: PATH_ACCOUNTS_MANAGER.messages,
          icon: ICONS.tender_accounts_manager.messages,
        },
      ],
    },
  ],
  tender_moderator: [
    {
      subheader: '',
      items: [
        {
          title: 'dashboard',
          path: PATH_MODERATOR.app,
          icon: ICONS.tender_moderator.main,
        },

        {
          title: 'incoming_support_requests',
          path: PATH_MODERATOR.incoming_support_requests,
          icon: ICONS.tender_moderator.incoming_support_requests,
        },
        {
          title: 'previous_support_requests',
          path: PATH_MODERATOR.previous_support_requests,
          icon: ICONS.tender_moderator.previous_support_requests,
        },

        {
          title: 'portal_reports',
          path: PATH_MODERATOR.portal_reports,
          icon: ICONS.tender_moderator.portal_reports,
        },
        {
          title: 'messages',
          path: PATH_MODERATOR.messages,
          icon: ICONS.tender_moderator.messages,
        },
      ],
    },
  ],
  cluster_admin: [],
  tender_admin: [],
};

export default navConfig;
