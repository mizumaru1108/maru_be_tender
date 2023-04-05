// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_CLIENT = '/client';
const ROOTS_CONSULTANT = '/consultant';
const ROOTS_FINANCE = '/finance';
const ROOTS_CASHIER = '/cashier';
const ROOTS_CEO = '/ceo';
const ROOTS_PROJECT_MANAGER = '/project-manager';
const ROOTS_PROJECT_SUPERVISOR = '/project-supervisor';
const ROOTS_ACCOUNTS_MANAGER = '/accounts-manager';
const ROOTS_MODERATOR = '/moderator';
const ROOTS_ADMIN = '/admin';
// ----------------------------------------------------------------------

export const PATH_ADMIN = {
  root: ROOTS_ADMIN,
  app: path(ROOTS_ADMIN, '/dashboard/app'),
  transaction_progression: path(ROOTS_ADMIN, '/dashboard/transaction-progression'),
  tracks_budget: path(ROOTS_ADMIN, '/dashboard/tracks-budget'),
  gregorian_year: path(ROOTS_ADMIN, '/dashboard/gregorian-year'),
  application_and_admission_settings: path(
    ROOTS_ADMIN,
    '/dashboard/application-and-admission-settings'
  ),
  mobile_settings: path(ROOTS_ADMIN, '/dashboard/mobile-settings'),
  system_messages: path(ROOTS_ADMIN, '/dashboard/system-messages'),
  system_configuration: path(ROOTS_ADMIN, '/dashboard/system-configuration'),
  users_and_permissions: path(ROOTS_ADMIN, '/dashboard/users-and-permissions'),
  users_and_permissions_edit: (partnerId: string) =>
    path(ROOTS_ADMIN, `/dashboard/users-and-permissions/edit/${partnerId}`),
  authority: path(ROOTS_ADMIN, '/dashboard/authority'),
  entity_area: path(ROOTS_ADMIN, '/dashboard/entity-area'),
  regions_project_location: path(ROOTS_ADMIN, '/dashboard/regions-project-location'),
  entity_classification: path(ROOTS_ADMIN, '/dashboard/entity-classification'),
  bank_name: path(ROOTS_ADMIN, '/dashboard/bank-name'),
  beneficiaries: path(ROOTS_ADMIN, '/dashboard/beneficiaries'),
  portal_reports: path(ROOTS_ADMIN, '/dashboard/portal-reports'),
  messages: path(ROOTS_ADMIN, '/dashboard/messages'),
  client_list: path(ROOTS_ADMIN, '/dashboard/client-list'),
  old_proposal: path(ROOTS_ADMIN, '/dashboard/old-proposal'),
};
export const PATH_CLIENT = {
  root: ROOTS_CLIENT,
  app: path(ROOTS_CLIENT, '/dashboard/app'),
  funding_project_request: path(ROOTS_CLIENT, '/dashboard/funding-project-request'),
  incoming_close_reports: path(ROOTS_CLIENT, '/dashboard/project-report'),
  drafts: path(ROOTS_CLIENT, '/dashboard/draft-funding-requests'),
  previous_funding_requests: path(ROOTS_CLIENT, '/dashboard/previous-funding-requests'),
  messages: path(ROOTS_CLIENT, '/dashboard/messages'),
  contact_support: path(ROOTS_CLIENT, '/dashboard/contact-support'),
  client_appointments: path(ROOTS_CLIENT, '/dashboard/appointments'),
  old_proposal: path(ROOTS_CLIENT, '/dashboard/old-proposal'),
};

export const PATH_CONSULTANT = {
  root: ROOTS_CONSULTANT,
  app: path(ROOTS_CONSULTANT, '/dashboard/app'),
  incoming_funding_requests: path(ROOTS_CONSULTANT, '/dashboard/incoming-funding-requests'),
  portal_reports: path(ROOTS_CONSULTANT, '/dashboard/portal-reports'),
  messages: path(ROOTS_CONSULTANT, '/dashboard/messages'),
  old_proposal: path(ROOTS_CONSULTANT, '/dashboard/old-proposal'),
};

export const PATH_FINANCE = {
  root: ROOTS_FINANCE,
  app: path(ROOTS_FINANCE, '/dashboard/app'),
  incoming_exchange_permission_requests: path(
    ROOTS_FINANCE,
    '/dashboard/incoming-exchange-permission-requests'
  ),
  requests_in_process: path(ROOTS_FINANCE, '/dashboard/requests-in-process'),
  previous_funding_requests: path(ROOTS_FINANCE, '/dashboard/previous-funding-requests'),
  portal_reports: path(ROOTS_FINANCE, '/dashboard/portal-reports'),
  messages: path(ROOTS_FINANCE, '/dashboard/messages'),
  old_proposal: path(ROOTS_FINANCE, '/dashboard/old-proposal'),
};

export const PATH_CASHIER = {
  root: ROOTS_CASHIER,
  app: path(ROOTS_CASHIER, '/dashboard/app'),
  incoming_exchange_permission_requests: path(
    ROOTS_CASHIER,
    '/dashboard/incoming-exchange-permission-requests'
  ),
  requests_in_process: path(ROOTS_CASHIER, '/dashboard/requests-in-process'),
  previous_funding_requests: path(ROOTS_CASHIER, '/dashboard/previous-funding-requests'),
  portal_reports: path(ROOTS_CASHIER, '/dashboard/portal-reports'),
  messages: path(ROOTS_CASHIER, '/dashboard/messages'),
  old_proposal: path(ROOTS_CASHIER, '/dashboard/old-proposal'),
};

export const PATH_CEO = {
  root: ROOTS_CEO,
  app: path(ROOTS_CEO, '/dashboard/app'),
  project_management: path(ROOTS_CEO, '/dashboard/project-management'),
  rejection_list: path(ROOTS_CEO, '/dashboard/rejection-list'),
  client_list: path(ROOTS_CEO, '/dashboard/client-list'),
  previous_funding_requests: path(ROOTS_CEO, '/dashboard/previous-funding-requests'),
  portal_reports: path(ROOTS_CEO, '/dashboard/portal-reports'),
  messages: path(ROOTS_CEO, '/dashboard/messages'),
  old_proposal: path(ROOTS_CEO, '/dashboard/old-proposal'),
};

export const PATH_PROJECT_MANAGER = {
  root: ROOTS_PROJECT_MANAGER,
  app: path(ROOTS_PROJECT_MANAGER, '/dashboard/app'),
  incoming_funding_requests: path(ROOTS_PROJECT_MANAGER, '/dashboard/incoming-funding-requests'),
  requests_in_process: path(ROOTS_PROJECT_MANAGER, '/dashboard/requests-in-process'),
  previous_funding_requests: path(ROOTS_PROJECT_MANAGER, '/dashboard/previous-funding-requests'),
  exchange_permission: path(ROOTS_PROJECT_MANAGER, '/dashboard/exchange-permission'),
  portal_reports: path(ROOTS_PROJECT_MANAGER, '/dashboard/portal-reports'),
  messages: path(ROOTS_PROJECT_MANAGER, '/dashboard/messages'),
  // appointments_with_partners: path(ROOTS_PROJECT_MANAGER, '/dashboard/appointments-with-partners'),
  rejection_list: path(ROOTS_PROJECT_MANAGER, '/dashboard/rejection-list'),
  client_list: path(ROOTS_PROJECT_MANAGER, '/dashboard/client-list'),
  old_proposal: path(ROOTS_PROJECT_MANAGER, '/dashboard/old-proposal'),
};

export const PATH_MODERATOR = {
  root: ROOTS_MODERATOR,
  app: path(ROOTS_MODERATOR, '/dashboard/app'),
  incoming_support_requests: path(ROOTS_MODERATOR, '/dashboard/incoming-support-requests'),
  previous_support_requests: path(ROOTS_MODERATOR, '/dashboard/previous-funding-requests'),
  portal_reports: path(ROOTS_MODERATOR, '/dashboard/portal-reports'),
  messages: path(ROOTS_MODERATOR, '/dashboard/messages'),
  old_proposal: path(ROOTS_MODERATOR, '/dashboard/old-proposal'),
};

export const PATH_PROJECT_SUPERVISOR = {
  root: ROOTS_PROJECT_SUPERVISOR,
  app: path(ROOTS_PROJECT_SUPERVISOR, '/dashboard/app'),
  incoming_funding_requests: path(ROOTS_PROJECT_SUPERVISOR, '/dashboard/incoming-funding-requests'),
  incoming_close_reports: path(ROOTS_PROJECT_SUPERVISOR, '/dashboard/project-report'),
  requests_in_process: path(ROOTS_PROJECT_SUPERVISOR, '/dashboard/requests-in-process'),
  previous_funding_requests: path(ROOTS_PROJECT_SUPERVISOR, '/dashboard/previous-funding-requests'),
  payment_adjustment: path(ROOTS_PROJECT_SUPERVISOR, '/dashboard/payment-adjustment'),
  portal_reports: path(ROOTS_PROJECT_SUPERVISOR, '/dashboard/portal-reports'),
  messages: path(ROOTS_PROJECT_SUPERVISOR, '/dashboard/messages'),
  appointments_with_partners: path(
    ROOTS_PROJECT_SUPERVISOR,
    '/dashboard/appointments-with-partners'
  ),
  old_proposal: path(ROOTS_PROJECT_SUPERVISOR, '/dashboard/old-proposal'),
};

export const PATH_ACCOUNTS_MANAGER = {
  root: ROOTS_ACCOUNTS_MANAGER,
  app: path(ROOTS_ACCOUNTS_MANAGER, '/dashboard/app'),
  newJoinRequest: path(ROOTS_ACCOUNTS_MANAGER, '/dashboard/new/join-request'),
  infoUpdateRequest: path(ROOTS_ACCOUNTS_MANAGER, '/dashboard/info/update-request'),
  partnerManagement: path(ROOTS_ACCOUNTS_MANAGER, '/dashboard/partner/management'),
  partnerEditProfileDetails: (requestId: string, editStatus: string) =>
    path(ROOTS_ACCOUNTS_MANAGER, `/dashboard/partner/${requestId}/${editStatus}`),
  partnerDetails: (partnerId: string) =>
    path(ROOTS_ACCOUNTS_MANAGER, `/dashboard/partner/${partnerId}`),
  partnerSendAmandement: (partnerId: string) =>
    path(ROOTS_ACCOUNTS_MANAGER, `/dashboard/partner/${partnerId}/amendment-request`),
  portalReports: path(ROOTS_ACCOUNTS_MANAGER, '/dashboard/portal-reports'),
  messages: path(ROOTS_ACCOUNTS_MANAGER, '/dashboard/messages'),
};

/************************************************* */
export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  forgotPassword: path(ROOTS_AUTH, '/forgot-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};
export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page403: '/403',
  page404: '/404',
  page500: '/500',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  fundraising: path(ROOTS_DASHBOARD, '/fundraising'),
  hr: {
    root: path(ROOTS_DASHBOARD, '/hr'),
    home: path(ROOTS_DASHBOARD, '/hr/home'),
    employee: {
      list: path(ROOTS_DASHBOARD, '/hr/employee/list'),
      type: path(ROOTS_DASHBOARD, '/hr/employee/type'),
      dapartement: path(ROOTS_DASHBOARD, '/hr/employee/dapartement'),
      designation: path(ROOTS_DASHBOARD, '/hr/employee/designation'),
      branch: path(ROOTS_DASHBOARD, '/hr/employee/branch'),
    },
    jobs: {},
  },
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title: string) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
