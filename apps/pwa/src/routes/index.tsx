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
        { element: <Navigate to="/dashboard" replace />, index: true },
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
        { element: <Navigate to="/dashboard" replace />, index: true },
        {
          path: 'my-profile',
          children: [
            { path: '', element: <ModeratorProfile /> },
            { path: 'edit', element: <ModeratorProfileEdit /> },
          ],
        },
        {
          path: 'dashboard',
          children: [
            { path: 'app', element: <MainModeratorPage /> },
            {
              path: 'support-requests-received',
              element: <SupportRequestsReceived />,
            },

            { path: 'messages', element: <ModeratorMessages /> },
          ],
        },
      ],
    },
    // Consultant Routes
    // {
    //   path: 'consultant',
    //   element: (
    //     <AuthGuard>
    //       <RoleBasedGuard roles={['tender_consultant']} hasContent={true}>
    //         <DashboardLayout />
    //       </RoleBasedGuard>
    //     </AuthGuard>
    //   ),
    //   children: [
    //     { element: <Navigate to="/dashboard" replace />, index: true },
    //     {
    //       path: 'dashboard',
    //       children: [
    //         { path: 'app', element: <MainClientPage /> },
    //         {
    //           path: 'funding-project-request',
    //           element: <FundingProjectRequest />,
    //         },
    //         {
    //           path: 'draft-funding-requests',
    //           children: [{ path: '', element: <DraftFundingRequests /> }],
    //         },
    //         {
    //           path: 'previous-funding-requests',
    //           children: [
    //             {
    //               path: '',
    //               element: <PreviousFundingRequests />,
    //             },
    //             // {
    //             //   path: ':id/:actionType',
    //             //   children: [
    //             //     { path: 'main', element: <ProjectDetails /> },
    //             //     { path: 'project-budget', element: <ProjectDetails /> },
    //             //   ],
    //             // },
    //           ],
    //         },
    //         { path: 'messages', element: <Messages /> },
    //         {
    //           path: 'contact-support',
    //           element: <ContactSupport />,
    //         },
    //       ],
    //     },
    //   ],
    // },
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
      element: <Navigate to={'auth/login'} replace />,
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
const ModeratorProfileEdit = Loadable(lazy(() => import('pages/moderator/ModeratorProfileEdit')));
const ModeratorMessages = Loadable(lazy(() => import('pages/moderator/ModeratorMessages')));
const SupportRequestsReceived = Loadable(
  lazy(() => import('pages/moderator/support-requests-received'))
);

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
