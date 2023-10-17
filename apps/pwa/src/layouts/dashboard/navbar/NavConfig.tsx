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
  PATH_ADMIN,
} from '../../../routes/paths';
import SvgIconStyle from '../../../components/SvgIconStyle';
import {
  FEATURE_CONTACT_US_BY_CLIENT,
  FEATURE_MENU_ADMIN_ADD_AUTHORITY,
  FEATURE_MENU_ADMIN_ENTITY_AREA,
  FEATURE_MENU_ADMIN_ENTITY_CLASSIFICATION,
  FEATURE_MENU_ADMIN_REGIONS,
  FEATURE_MENU_CLIENT_FILES,
  FEATURE_SEND_EMAIL_TO_CLIENT,
} from 'config';

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
    client_appointments: getIcon('client_appointments'),
    old_proposal: getIcon('previous-request'),
  },
  tender_consultant: {
    main: getIcon('main'),
    incoming_funding_requests: getIcon('incoming-funding-requests'),
    portal_reports: getIcon('portal-reports'),
    messages: getIcon('message-bar'),
    old_proposal: getIcon('previous-request'),
  },
  tender_finance: {
    main: getIcon('main'),
    incoming_exchange_permission_requests: getIcon('incoming-exchange-permission-requests'),
    incoming_exchange_permission_requests_with_vat: getIcon(
      'incoming-exchange-permission-requests'
    ),
    requests_in_process: getIcon('requests-in-process'),
    requests_in_process_with_vat: getIcon('requests-in-process'),
    previous_funding_requests: getIcon('previous-request'),
    portal_reports: getIcon('portal-reports'),
    messages: getIcon('message-bar'),
    old_proposal: getIcon('previous-request'),
  },
  tender_cashier: {
    main: getIcon('main'),
    Incoming_exchange_permission_requests: getIcon('incoming-exchange-permission-requests'),
    requests_in_process: getIcon('requests-in-process'),
    previous_funding_requests: getIcon('previous-request'),
    portal_reports: getIcon('portal-reports'),
    messages: getIcon('message-bar'),
    old_proposal: getIcon('previous-request'),
  },
  tender_ceo: {
    main: getIcon('main'),
    project_management: getIcon('project-management'),
    rejection_list: getIcon('rejection-list'),
    client_list: getIcon('users-and-permissions'),
    previous_funding_requests: getIcon('previous-funding-requests'),
    portal_reports: getIcon('portal-reports'),
    messages: getIcon('message-bar'),
    old_proposal: getIcon('previous-request'),
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
    old_proposal: getIcon('previous-request'),
  },
  tender_project_supervisor: {
    main: getIcon('main'),
    incoming_funding_requests: getIcon('incoming-funding-requests-project-supervisor'),
    requests_in_process: getIcon('requests-in-process'),
    previous_funding_requests: getIcon('previous-funding-requests'),
    payment_adjustment: getIcon('payment-adjustment'),
    portal_reports: getIcon('portal-reports'),
    messages: getIcon('message-bar'),
    appointments_with_partners: getIcon('appointments-with-partners'),
    old_proposal: getIcon('previous-request'),
    emails: getIcon('system-messages'),
  },
  tender_moderator: {
    main: getIcon('main'),
    incoming_support_requests: getIcon('previous-request'),
    previous_support_requests: getIcon('draft-request'),
    portal_reports: getIcon('request-for-project'),
    messages: getIcon('message-bar'),
    old_proposal: getIcon('previous-request'),
  },
  tender_accounts_manager: {
    main: getIcon('main'),
    newJoinRequest: getIcon('new-join-request'),
    infoUpdateRequest: getIcon('information-update-request'),
    partnerManagement: getIcon('users-and-permissions'),
    portal_reports: getIcon('portal-reports'),
    messages: getIcon('message-bar'),
    old_proposal: getIcon('previous-request'),
  },
  tender_admin: {
    main: getIcon('main'),
    transaction_progression: getIcon('transaction-progression'),
    tracks_budget: getIcon('tracks-budget'),
    gregorian_year: getIcon('gregorian-year'),
    application_and_admission_settings: getIcon('application-and-admission-settings'),
    mobile_settings: getIcon('mobile-settings'),
    system_messages: getIcon('system-messages'),
    system_configuration: getIcon('system-configuration'),
    users_and_permissions: getIcon('users-and-permissions'),
    authority: getIcon('authority'),
    entity_area: getIcon('entity-area'),
    regions_project_location: getIcon('regions-project-location'),
    entity_classification: getIcon('entity-classification'),
    bank_name: getIcon('bank-name'),
    beneficiaries: getIcon('beneficiaries'),
    portal_reports: getIcon('portal-reports'),
    messages: getIcon('message-bar'),
    customization_for_dropdown: getIcon('drop-down-white'),
    old_proposal: getIcon('previous-request'),
    contact_us: getIcon('system-messages'),
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
          title: 'old_proposal.title',
          path: PATH_CLIENT.old_proposal,
          icon: ICONS.tender_client.old_proposal,
        },
        FEATURE_MENU_CLIENT_FILES &&
          ({
            title: 'client_files.title',
            path: PATH_CLIENT.client_files,
            icon: ICONS.tender_moderator.old_proposal,
          } as any),
        {
          title: 'pages.common.close_report.text.project_report',
          path: PATH_CLIENT.incoming_close_reports,
          icon: ICONS.tender_project_supervisor.payment_adjustment,
        },
        {
          title: 'messages',
          path: PATH_CLIENT.messages,
          icon: ICONS.tender_client.messages,
        },
        {
          title: 'contact_support_title',
          path: PATH_CLIENT.contact_support,
          icon: ICONS.tender_client.support,
        },
        {
          title: 'client_appointments',
          path: PATH_CLIENT.client_appointments,
          icon: ICONS.tender_client.client_appointments,
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
          title: 'old_proposal.title',
          path: PATH_CONSULTANT.old_proposal,
          icon: ICONS.tender_consultant.old_proposal,
        },

        FEATURE_MENU_CLIENT_FILES &&
          ({
            title: 'client_files.title',
            path: PATH_CONSULTANT.client_files,
            icon: ICONS.tender_moderator.old_proposal,
          } as any),
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
        // {
        //   title: 'incoming_exchange_permission_requests_with_vat',
        //   path: PATH_FINANCE.incoming_exchange_permission_requests_with_vat,
        //   icon: ICONS.tender_finance.incoming_exchange_permission_requests,
        // },
        {
          title: 'requests_in_process',
          path: PATH_FINANCE.requests_in_process,
          icon: ICONS.tender_finance.requests_in_process,
        },
        {
          title: 'requests_in_process_with_vat',
          path: PATH_FINANCE.requests_in_process_with_vat,
          icon: ICONS.tender_finance.requests_in_process_with_vat,
        },
        {
          title: 'previous_funding_requests',
          path: PATH_FINANCE.previous_funding_requests,
          icon: ICONS.tender_finance.previous_funding_requests,
        },
        {
          title: 'old_proposal.title',
          path: PATH_FINANCE.old_proposal,
          icon: ICONS.tender_finance.old_proposal,
        },
        FEATURE_MENU_CLIENT_FILES &&
          ({
            title: 'client_files.title',
            path: PATH_FINANCE.client_files,
            icon: ICONS.tender_moderator.old_proposal,
          } as any),
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
          title: 'previous_funding_requests',
          path: PATH_CASHIER.previous_funding_requests,
          icon: ICONS.tender_cashier.previous_funding_requests,
        },
        {
          title: 'old_proposal.title',
          path: PATH_CASHIER.old_proposal,
          icon: ICONS.tender_cashier.old_proposal,
        },
        FEATURE_MENU_CLIENT_FILES &&
          ({
            title: 'client_files.title',
            path: PATH_CASHIER.client_files,
            icon: ICONS.tender_moderator.old_proposal,
          } as any),
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
          title: 'project_management',
          path: PATH_CEO.project_management,
          icon: ICONS.tender_ceo.project_management,
        },
        {
          title: 'rejection_list',
          path: PATH_CEO.rejection_list,
          icon: ICONS.tender_ceo.rejection_list,
        },
        {
          title: 'client_list',
          path: PATH_CEO.client_list,
          icon: ICONS.tender_ceo.client_list,
        },
        {
          title: 'previous_funding_requests',
          path: PATH_CEO.previous_funding_requests,
          icon: ICONS.tender_ceo.previous_funding_requests,
        },
        {
          title: 'old_proposal.title',
          path: PATH_CEO.old_proposal,
          icon: ICONS.tender_ceo.old_proposal,
        },
        FEATURE_MENU_CLIENT_FILES &&
          ({
            title: 'client_files.title',
            path: PATH_CEO.client_files,
            icon: ICONS.tender_moderator.old_proposal,
          } as any),
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
          title: 'exchange_permission',
          path: PATH_PROJECT_MANAGER.exchange_permission,
          icon: ICONS.tender_project_manager.exchange_permission,
        },
        {
          title: 'previous_funding_requests',
          path: PATH_PROJECT_MANAGER.previous_funding_requests,
          icon: ICONS.tender_project_manager.previous_funding_requests,
        },
        {
          title: 'old_proposal.title',
          path: PATH_PROJECT_MANAGER.old_proposal,
          icon: ICONS.tender_project_manager.old_proposal,
        },
        FEATURE_MENU_CLIENT_FILES &&
          ({
            title: 'client_files.title',
            path: PATH_PROJECT_MANAGER.client_files,
            icon: ICONS.tender_moderator.old_proposal,
          } as any),
        {
          title: 'client_list',
          path: PATH_PROJECT_MANAGER.client_list,
          icon: ICONS.tender_ceo.client_list,
        },
        {
          title: 'rejection_list',
          path: PATH_PROJECT_MANAGER.rejection_list,
          icon: ICONS.tender_ceo.rejection_list,
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
        // {
        //   title: 'appointments_with_partners',
        //   path: PATH_PROJECT_MANAGER.appointments_with_partners,
        //   icon: ICONS.tender_project_manager.appointments_with_partners,
        // },
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
          title: 'old_proposal.title',
          path: PATH_PROJECT_SUPERVISOR.old_proposal,
          icon: ICONS.tender_project_supervisor.old_proposal,
        },
        FEATURE_MENU_CLIENT_FILES &&
          ({
            title: 'client_files.title',
            path: PATH_PROJECT_SUPERVISOR.client_files,
            icon: ICONS.tender_moderator.old_proposal,
          } as any),
        {
          title: 'payment_adjustment',
          path: PATH_PROJECT_SUPERVISOR.payment_adjustment,
          icon: ICONS.tender_project_supervisor.payment_adjustment,
        },

        {
          title: 'pages.common.close_report.text.project_report',
          icon: ICONS.tender_project_supervisor.payment_adjustment,
          children: [
            {
              title: 'pages.common.close_report.text.incoming_project_report',
              path: PATH_PROJECT_SUPERVISOR.incoming_close_reports,
              icon: ICONS.tender_project_supervisor.payment_adjustment,
            },
            {
              title: 'pages.common.close_report.text.complete_project_report',
              path: PATH_PROJECT_SUPERVISOR.complete_close_reports,
              icon: ICONS.tender_project_supervisor.payment_adjustment,
            },
            {
              title: 'pages.common.close_report.text.pending_project_report',
              path: PATH_PROJECT_SUPERVISOR.pending_close_reports,
              icon: ICONS.tender_project_supervisor.payment_adjustment,
            },
          ],
        },

        {
          title: 'client_list',
          path: PATH_PROJECT_SUPERVISOR.client_list,
          icon: ICONS.tender_ceo.client_list,
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
        FEATURE_SEND_EMAIL_TO_CLIENT && {
          title: 'emails',
          path: PATH_PROJECT_SUPERVISOR.emails,
          icon: ICONS.tender_project_supervisor.emails,
        },
        {
          title: 'appointments_with_partners',
          path: PATH_PROJECT_SUPERVISOR.appointments_with_partners,
          icon: ICONS.tender_project_supervisor.appointments_with_partners,
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
          title: 'account_manager.heading.new_join_request',
          path: PATH_ACCOUNTS_MANAGER.newJoinRequest,
          icon: ICONS.tender_accounts_manager.newJoinRequest,
        },

        {
          title: 'account_manager.heading.info_update_request',
          path: PATH_ACCOUNTS_MANAGER.infoUpdateRequest,
          icon: ICONS.tender_accounts_manager.infoUpdateRequest,
        },
        {
          title: 'account_manager.heading.partner_management',
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
          title: 'main',
          path: PATH_MODERATOR.app,
          icon: ICONS.tender_moderator.main,
        },

        {
          title: 'incoming_funding_requests',
          path: PATH_MODERATOR.incoming_support_requests,
          icon: ICONS.tender_moderator.incoming_support_requests,
        },
        {
          title: 'previous_funding_requests',
          path: PATH_MODERATOR.previous_support_requests,
          icon: ICONS.tender_moderator.previous_support_requests,
        },
        {
          title: 'old_proposal.title',
          path: PATH_MODERATOR.old_proposal,
          icon: ICONS.tender_moderator.old_proposal,
        },
        FEATURE_MENU_CLIENT_FILES &&
          ({
            title: 'client_files.title',
            path: PATH_MODERATOR.client_files,
            icon: ICONS.tender_moderator.old_proposal,
          } as any),
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
  tender_admin: [
    {
      subheader: '',
      items: [
        {
          title: 'main',
          path: PATH_ADMIN.app,
          icon: ICONS.tender_admin.main,
        },

        {
          title: 'transaction_progression',
          path: PATH_ADMIN.transaction_progression,
          icon: ICONS.tender_admin.transaction_progression,
        },
        {
          title: 'tracks_budget',
          path: PATH_ADMIN.tracks_budget,
          icon: ICONS.tender_admin.tracks_budget,
        },

        // {
        //   title: 'gregorian_year',
        //   path: PATH_ADMIN.gregorian_year,
        //   icon: ICONS.tender_admin.gregorian_year,
        // },
        // {
        //   title: 'application_and_admission_settings',
        //   path: PATH_ADMIN.application_and_admission_settings,
        //   icon: ICONS.tender_admin.application_and_admission_settings,
        // },
        // {
        //   title: 'mobile_settings',
        //   path: PATH_ADMIN.mobile_settings,
        //   icon: ICONS.tender_admin.mobile_settings,
        // },
        {
          title: 'system_messages_menu',
          path: PATH_ADMIN.system_messages,
          icon: ICONS.tender_admin.system_messages,
        },
        // {
        //   title: 'system_configuration',
        //   path: PATH_ADMIN.system_configuration,
        //   icon: ICONS.tender_admin.system_configuration,
        // },
        {
          title: 'client_list',
          path: PATH_ADMIN.client_list,
          icon: ICONS.tender_admin.users_and_permissions,
        },
        {
          title: 'users_and_permissions',
          path: PATH_ADMIN.users_and_permissions,
          icon: ICONS.tender_admin.users_and_permissions,
        },
        {
          title: 'customization_for_dropdown',
          path: '',
          icon: ICONS.tender_admin.customization_for_dropdown,
          children: [
            FEATURE_MENU_ADMIN_ADD_AUTHORITY &&
              ({
                title: 'authority',
                path: PATH_ADMIN.authority,
                icon: ICONS.tender_admin.authority,
              } as any),
            // {
            //   title: 'authority',
            //   path: PATH_ADMIN.authority,
            //   icon: ICONS.tender_admin.authority,
            // },
            FEATURE_MENU_ADMIN_ENTITY_AREA &&
              ({
                // title: 'entity_area',
                title: 'pages.admin.settings.label.governorate.list_of_governorate',
                path: PATH_ADMIN.entity_area,
                icon: ICONS.tender_admin.entity_area,
              } as any),
            // {
            //   title: 'entity_area',
            //   path: PATH_ADMIN.entity_area,
            //   icon: ICONS.tender_admin.entity_area,
            // },
            FEATURE_MENU_ADMIN_REGIONS &&
              ({
                title: 'regions_project_location',
                path: PATH_ADMIN.regions_project_location,
                icon: ICONS.tender_admin.regions_project_location,
              } as any),
            // {
            //   title: 'regions_project_location',
            //   path: PATH_ADMIN.regions_project_location,
            //   icon: ICONS.tender_admin.regions_project_location,
            // },
            FEATURE_MENU_ADMIN_ENTITY_CLASSIFICATION &&
              ({
                title: 'entity_classification',
                path: PATH_ADMIN.entity_classification,
                icon: ICONS.tender_admin.entity_classification,
              } as any),
            // {
            //   title: 'entity_classification',
            //   path: PATH_ADMIN.entity_classification,
            //   icon: ICONS.tender_admin.entity_classification,
            // },
            {
              title: 'bank_name',
              path: PATH_ADMIN.bank_name,
              icon: ICONS.tender_admin.bank_name,
            },
            {
              title: 'beneficiaries',
              path: PATH_ADMIN.beneficiaries,
              icon: ICONS.tender_admin.beneficiaries,
            },
          ],
        },
        // {
        //   title: 'authority',
        //   path: PATH_ADMIN.authority,
        //   icon: ICONS.tender_admin.authority,
        // },
        // {
        //   title: 'entity_area',
        //   path: PATH_ADMIN.entity_area,
        //   icon: ICONS.tender_admin.entity_area,
        // },
        // {
        //   title: 'regions_project_location',
        //   path: PATH_ADMIN.regions_project_location,
        //   icon: ICONS.tender_admin.regions_project_location,
        // },
        // {
        //   title: 'entity_classification',
        //   path: PATH_ADMIN.entity_classification,
        //   icon: ICONS.tender_admin.entity_classification,
        // },
        // {
        //   title: 'bank_name',
        //   path: PATH_ADMIN.bank_name,
        //   icon: ICONS.tender_admin.bank_name,
        // },
        // {
        //   title: 'beneficiaries',
        //   path: PATH_ADMIN.beneficiaries,
        //   icon: ICONS.tender_admin.beneficiaries,
        // },
        {
          title: 'old_proposal.title',
          path: PATH_ADMIN.old_proposal,
          icon: ICONS.tender_admin.old_proposal,
        },
        FEATURE_MENU_CLIENT_FILES &&
          ({
            title: 'client_files.title',
            path: PATH_ADMIN.client_files,
            icon: ICONS.tender_moderator.old_proposal,
          } as any),
        {
          title: 'portal_reports',
          path: PATH_ADMIN.portal_reports,
          icon: ICONS.tender_admin.portal_reports,
        },
        FEATURE_CONTACT_US_BY_CLIENT &&
          ({
            title: 'contact_us',
            path: PATH_ADMIN.contact_us,
            icon: ICONS.tender_admin.contact_us,
          } as any),
        {
          title: 'messages',
          path: PATH_ADMIN.messages,
          icon: ICONS.tender_admin.messages,
        },
      ],
    },
  ],
  cluster_admin: [],
};

export default navConfig;
