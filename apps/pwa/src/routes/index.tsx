import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import GuestGuard from '../guards/GuestGuard';
import { PATH_AFTER_LOGIN } from '../config';
import LoadingScreen from '../components/LoadingScreen';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = useAuth();

  const isDashboard = pathname.includes('/dashboard') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    // Auth Routes
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'new-password', element: <NewPassword /> },
      ],
    },
    // Client Routes
    {
      path: 'client',
      element: (
        <AuthGuard>
          <RoleBasedGuard roles={['tender_client']} hasContent={true}>
            <DashboardLayout />
          </RoleBasedGuard>
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/client/dashboard/app" replace />, index: true },
        {
          path: 'my-profile',
          children: [
            { path: '', element: <ClientProfile /> },
            { path: 'edit', element: <ClientProfileEdit /> },
          ],
        },
        {
          path: 'dashboard',
          children: [
            { element: <Navigate to="/client/dashboard/app" replace />, index: true },
            { path: 'app', element: <MainClientPage /> },
            {
              path: 'funding-project-request',
              element: <FundingProjectRequest />,
            },
            {
              path: 'draft-funding-requests',
              children: [{ path: '', element: <DraftFundingRequests /> }],
            },
            {
              path: 'previous-funding-requests',
              children: [
                {
                  path: '',
                  element: <PreviousFundingRequests />,
                },
                {
                  path: ':id/:actionType',
                  children: [
                    { path: 'main', element: <ProjectDetails /> },
                    { path: 'project-budget', element: <ProjectDetails /> },
                    { path: 'follow-ups', element: <ProjectDetails /> },
                    { path: 'payments', element: <ProjectDetails /> },
                  ],
                },
              ],
            },
            { path: 'messages', element: <Messages /> },
            {
              path: 'contact-support',
              element: <ContactSupport />,
            },
          ],
        },
      ],
    },

    // Moderator Routes
    {
      path: 'moderator',
      element: (
        <AuthGuard>
          <RoleBasedGuard roles={['tender_moderator']} hasContent={true}>
            <DashboardLayout />
          </RoleBasedGuard>
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/moderator/dashboard/app" replace />, index: true },
        {
          path: 'dashboard',
          children: [
            { element: <Navigate to="/moderator/dashboard/app" replace />, index: true },
            { path: 'app', element: <MainModeratorPage /> },
            {
              path: 'incoming-support-requests',
              // element: <IncomingSupportRequests />,
              children: [
                { path: '', element: <IncomingSupportRequests /> },
                {
                  path: ':id/:actionType',
                  children: [
                    { path: 'main', element: <ProjectDetails /> },
                    { path: 'project-path', element: <ProjectDetails /> },
                    { path: 'follow-ups', element: <ProjectDetails /> },
                  ],
                },
              ],
            },
            {
              path: 'previous-support-requests',
              // element: <IncomingSupportRequests />,
              children: [
                { path: '', element: <PreviouseSupportRequests /> },
                {
                  path: ':id/:actionType',
                  children: [{ path: 'main', element: <ProjectDetails /> }],
                },
              ],
            },

            // { path: 'previous-support-requests', element: <PreviouseSupportRequests /> },
            { path: 'portal-reports', element: <PortalReports /> },
            { path: 'messages', element: <ModeratorMessages /> },
          ],
        },
      ],
    },
    // Consultant Routes
    {
      path: 'consultant',
      element: (
        <AuthGuard>
          <RoleBasedGuard roles={['tender_consultant']} hasContent={true}>
            <DashboardLayout />
          </RoleBasedGuard>
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/consultant/dashboard/app" replace />, index: true },
        {
          path: 'dashboard',
          children: [
            { element: <Navigate to="/consultant/dashboard/app" replace />, index: true },
            { path: 'app', element: <MainConsultant /> },
            {
              path: 'incoming-funding-requests',
              children: [
                { path: '', element: <IncomingFundingRequestConsultant /> },
                {
                  path: ':id/:actionType',
                  children: [
                    { path: 'main', element: <ProjectDetails /> },
                    { path: 'project-budget', element: <ProjectDetails /> },
                    { path: 'project-path', element: <ProjectDetails /> },
                    { path: 'project-timeline', element: <ProjectDetails /> },
                    { path: 'follow-ups', element: <ProjectDetails /> },
                  ],
                },
              ],
            },
            {
              path: 'portal-reports',
              children: [{ path: '', element: <PortalReportsConsultant /> }],
            },
            { path: 'messages', element: <MessagesConsultant /> },
          ],
        },
      ],
    },
    // Accounts Manager Routes
    {
      path: 'accounts-manager',
      element: (
        <AuthGuard>
          <RoleBasedGuard roles={['tender_accounts_manager']} hasContent={true}>
            <DashboardLayout />
          </RoleBasedGuard>
        </AuthGuard>
      ),
      children: [
        {
          path: 'dashboard',
          children: [
            { path: 'app', element: <MainManagerPage /> },
            { path: 'new/join-request', element: <NewJoinRequestPage /> },
            { path: 'info/update-request', element: <InfoUpdateRequestPage /> },
            { path: 'partner/management', element: <PartnerManagementPage /> },
            { path: 'portal-reports', element: <PortalReportsPage /> },
            { path: 'messages', element: <MessagesManagerPage /> },
          ],
        },
      ],
    },
    // Finance Routes
    {
      path: 'finance',
      element: (
        <AuthGuard>
          <RoleBasedGuard roles={['tender_finance']} hasContent={true}>
            <DashboardLayout />
          </RoleBasedGuard>
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/finance/dashboard/app" replace />, index: true },
        {
          path: 'dashboard',
          children: [
            { element: <Navigate to="/finance/dashboard/app" replace />, index: true },
            { path: 'app', element: <MainFinance /> },
            {
              path: 'incoming-exchange-permission-requests',
              children: [
                { path: '', element: <IncomingExchangePermissionRequestsFinance /> },
                {
                  path: ':id/:actionType',
                  children: [
                    { path: 'main', element: <ProjectDetails /> },
                    { path: 'project-budget', element: <ProjectDetails /> },
                    { path: 'project-path', element: <ProjectDetails /> },
                    { path: 'project-timeline', element: <ProjectDetails /> },
                    { path: 'follow-ups', element: <ProjectDetails /> },
                    { path: 'payments', element: <ProjectDetails /> },
                    { path: 'exchange-details', element: <ProjectDetails /> },
                  ],
                },
              ],
            },
            {
              path: 'requests-in-process',
              children: [
                { path: '', element: <RequestsInProcessFinance /> },
                {
                  path: ':id/:actionType',
                  children: [
                    { path: 'main', element: <ProjectDetails /> },
                    { path: 'project-budget', element: <ProjectDetails /> },
                    { path: 'project-path', element: <ProjectDetails /> },
                    { path: 'project-timeline', element: <ProjectDetails /> },
                    { path: 'follow-ups', element: <ProjectDetails /> },
                    { path: 'payments', element: <ProjectDetails /> },
                    { path: 'exchange-details', element: <ProjectDetails /> },
                  ],
                },
              ],
            },
            { path: 'portal-reports', element: <PortalReportsFinance /> },
            { path: 'messages', element: <MessagesFinance /> },
          ],
        },
      ],
    },

    // Cashier Routes
    {
      path: 'cashier',
      element: (
        <AuthGuard>
          <RoleBasedGuard roles={['tender_cashier']} hasContent={true}>
            <DashboardLayout />
          </RoleBasedGuard>
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/cashier/dashboard/app" replace />, index: true },
        {
          path: 'dashboard',
          children: [
            { element: <Navigate to="/cashier/dashboard/app" replace />, index: true },
            { path: 'app', element: <MainCashier /> },
            {
              path: 'incoming-exchange-permission-requests',
              children: [
                { path: '', element: <IncomingExchangePermissionRequestsCashier /> },
                {
                  path: ':id/:actionType',
                  children: [
                    { path: 'main', element: <ProjectDetails /> },
                    { path: 'project-budget', element: <ProjectDetails /> },
                    { path: 'project-path', element: <ProjectDetails /> },
                    { path: 'project-timeline', element: <ProjectDetails /> },
                    { path: 'follow-ups', element: <ProjectDetails /> },
                    { path: 'payments', element: <ProjectDetails /> },
                  ],
                },
              ],
            },
            {
              path: 'requests-in-process',
              children: [
                { path: '', element: <RequestsInProcessCashier /> },
                {
                  path: ':id/:actionType',
                  children: [
                    { path: 'main', element: <ProjectDetails /> },
                    { path: 'project-budget', element: <ProjectDetails /> },
                    { path: 'project-path', element: <ProjectDetails /> },
                    { path: 'project-timeline', element: <ProjectDetails /> },
                    { path: 'follow-ups', element: <ProjectDetails /> },
                    { path: 'payments', element: <ProjectDetails /> },
                  ],
                },
              ],
            },
            { path: 'portal-reports', element: <PortalReportsCashier /> },
            { path: 'messages', element: <MessagesCashier /> },
          ],
        },
      ],
    },
    // Project Supervisor Routes
    {
      path: 'project-supervisor',
      element: (
        <AuthGuard>
          <RoleBasedGuard roles={['tender_project_supervisor']} hasContent={true}>
            <DashboardLayout />
          </RoleBasedGuard>
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/project-supervisor/dashboard/app" replace />, index: true },
        {
          path: 'dashboard',
          children: [
            { element: <Navigate to="/project-supervisor/dashboard/app" replace />, index: true },
            { path: 'app', element: <MainProjectSupervisor /> },
            {
              path: 'incoming-funding-requests',
              children: [
                { path: '', element: <IncomingFundingRequestsProjectSupervisor /> },
                {
                  path: ':id/:actionType',
                  children: [
                    { path: 'main', element: <ProjectDetails /> },
                    { path: 'project-budget', element: <ProjectDetails /> },
                    { path: 'project-path', element: <ProjectDetails /> },
                    { path: 'project-timeline', element: <ProjectDetails /> },
                    { path: 'follow-ups', element: <ProjectDetails /> },
                  ],
                },
              ],
            },
            {
              path: 'requests-in-process',
              children: [
                { path: '', element: <RequestsInProcessProjectSupervisor /> },
                {
                  path: ':id/:actionType',
                  children: [
                    { path: 'main', element: <ProjectDetails /> },
                    { path: 'project-budget', element: <ProjectDetails /> },
                    { path: 'project-path', element: <ProjectDetails /> },
                    { path: 'project-timeline', element: <ProjectDetails /> },
                    { path: 'follow-ups', element: <ProjectDetails /> },
                  ],
                },
              ],
            },
            {
              path: 'previous-funding-requests',
              children: [
                { path: '', element: <PreviousFundingRequestsProjectSupervisor /> },
                {
                  path: ':id/:actionType',
                  children: [
                    { path: 'main', element: <ProjectDetails /> },
                    { path: 'project-budget', element: <ProjectDetails /> },
                    { path: 'project-path', element: <ProjectDetails /> },
                    { path: 'project-timeline', element: <ProjectDetails /> },
                    { path: 'follow-ups', element: <ProjectDetails /> },
                  ],
                },
              ],
            },
            {
              path: 'payment-adjustment',
              children: [
                { path: '', element: <PaymentAdjustmenProjectSupervisor /> },
                {
                  path: ':id/:actionType',
                  children: [
                    { path: '', element: <PaymentAdjustmenProjectSupervisor /> },
                    { path: 'main', element: <ProjectDetails /> },
                    { path: 'project-budget', element: <ProjectDetails /> },
                    { path: 'project-path', element: <ProjectDetails /> },
                    { path: 'project-timeline', element: <ProjectDetails /> },
                    { path: 'follow-ups', element: <ProjectDetails /> },
                    { path: 'payments', element: <ProjectDetails /> },
                  ],
                },
              ],
            },
            { path: 'portal-reports', element: <PortalReportsProjectSupervisor /> },
            { path: 'messages', element: <MessagesProjectSupervisor /> },
          ],
        },
      ],
    },
    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <Navigate to={'/auth/login'} replace />,
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// CLIENT ROUTES
const FundingProjectRequest = Loadable(lazy(() => import('pages/client/FundingProjectRequest')));
const DraftFundingRequests = Loadable(lazy(() => import('pages/client/draft-funding-requests')));
const PreviousFundingRequests = Loadable(
  lazy(() => import('pages/client/previous-funding-requests'))
);
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));
const Messages = Loadable(lazy(() => import('pages/client/Messages')));
const ContactSupport = Loadable(lazy(() => import('pages/client/ContactSupport')));
const MainClientPage = Loadable(lazy(() => import('pages/client/MainClientPage')));
const ClientProfile = Loadable(lazy(() => import('pages/client/ClientProfile')));
const ClientProfileEdit = Loadable(lazy(() => import('pages/client/ClientProfileEdit')));

// MANAGER ROUTES
const MainManagerPage = Loadable(lazy(() => import('pages/accounts-manager/MainManagerPage')));
const NewJoinRequestPage = Loadable(lazy(() => import('pages/accounts-manager/new/join-request')));
const InfoUpdateRequestPage = Loadable(
  lazy(() => import('pages/accounts-manager/info/update-request'))
);
const PartnerManagementPage = Loadable(
  lazy(() => import('pages/accounts-manager/partner/management'))
);
const PortalReportsPage = Loadable(lazy(() => import('pages/accounts-manager/PortalReportsPage')));
const MessagesManagerPage = Loadable(lazy(() => import('pages/accounts-manager/Messages')));

// MODERATOR ROUTES
const MainModeratorPage = Loadable(lazy(() => import('pages/moderator/MainModeratorPage')));
const ModeratorProfile = Loadable(lazy(() => import('pages/moderator/ModeratorProfile')));
// const ModeratorProfileEdit = Loadable(lazy(() => import('pages/moderator/ModeratorProfileEdit')));
const ModeratorMessages = Loadable(lazy(() => import('pages/moderator/ModeratorMessages')));
const IncomingSupportRequests = Loadable(
  lazy(() => import('pages/moderator/incoming-support-requests'))
);
const PreviouseSupportRequests = Loadable(
  lazy(() => import('pages/moderator/previous-support-requests'))
);
const PortalReports = Loadable(lazy(() => import('pages/moderator/PortalReports')));

// CONSULTANT ROUTES
const MainConsultant = Loadable(lazy(() => import('pages/consultant/MainPage')));
const IncomingFundingRequestConsultant = Loadable(
  lazy(() => import('pages/consultant/IncomingFundingRequests'))
);
const PortalReportsConsultant = Loadable(lazy(() => import('pages/consultant/PortalReports')));
const MessagesConsultant = Loadable(lazy(() => import('pages/consultant/Messages')));

// FINANCE ROUTES
const MainFinance = Loadable(lazy(() => import('pages/finance/MainPage')));
const IncomingExchangePermissionRequestsFinance = Loadable(
  lazy(() => import('pages/finance/IncomingExchangePermissionRequests'))
);
const RequestsInProcessFinance = Loadable(lazy(() => import('pages/finance/RequestsInProcess')));
const PortalReportsFinance = Loadable(lazy(() => import('pages/finance/PortalReports')));
const MessagesFinance = Loadable(lazy(() => import('pages/finance/Messages')));

// CASHIER ROUTES
const MainProjectSupervisor = Loadable(lazy(() => import('pages/project-supervisor/MainPage')));
const IncomingFundingRequestsProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/IncomingFundingRequests'))
);
const RequestsInProcessProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/RequestsInProcess'))
);
const PreviousFundingRequestsProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/PreviousFundingRequests'))
);
const PaymentAdjustmenProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/PaymentAdjustment'))
);
const PortalReportsProjectSupervisor = Loadable(
  lazy(() => import('pages/project-supervisor/PortalReports'))
);
const MessagesProjectSupervisor = Loadable(lazy(() => import('pages/project-supervisor/Messages')));

// PROJECT_SUPERVISOR ROUTES
const MainCashier = Loadable(lazy(() => import('pages/cashier/MainPage')));
const IncomingExchangePermissionRequestsCashier = Loadable(
  lazy(() => import('pages/cashier/IncomingExchangePermissionRequests'))
);
const RequestsInProcessCashier = Loadable(lazy(() => import('pages/cashier/RequestsInProcess')));
const PortalReportsCashier = Loadable(lazy(() => import('pages/cashier/PortalReports')));
const MessagesCashier = Loadable(lazy(() => import('pages/cashier/Messages')));
// AUTHENTICATION ROUTES
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const NewPassword = Loadable(lazy(() => import('../pages/auth/NewPassword')));

// EXTRA ROUTES
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));
