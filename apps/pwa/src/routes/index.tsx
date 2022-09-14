import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
// import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

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
        // { path: 'verify', element: <VerifyCode /> },s
      ],
    },
    // Client Routes
    {
      path: 'client',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
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
              children: [
                { path: '', element: <DraftFundingRequests /> },
                { path: ':id/:actionType', element: <DraftFundingRequestShow /> },
              ],
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
                  element: <PreviousFundingRequestShow />,
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
    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: 'pricing', element: <Pricing /> },
        { path: 'payment', element: <Payment /> },
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
const DraftFundingRequestShow = Loadable(
  lazy(() => import('pages/client/draft-funding-requests/show'))
);
const PreviousFundingRequests = Loadable(
  lazy(() => import('pages/client/previous-funding-requests'))
);
const PreviousFundingRequestShow = Loadable(
  lazy(() => import('pages/client/previous-funding-requests/show'))
);
const Messages = Loadable(lazy(() => import('pages/client/Messages')));
const ContactSupport = Loadable(lazy(() => import('pages/client/ContactSupport')));
const MainClientPage = Loadable(lazy(() => import('pages/client/MainClientPage')));
const ClientProfile = Loadable(lazy(() => import('pages/client/ClientProfile')));
const ClientProfileEdit = Loadable(lazy(() => import('pages/client/ClientProfileEdit')));
// AUTHENTICATION ROUTES
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const NewPassword = Loadable(lazy(() => import('../pages/auth/NewPassword')));

// EXTRA ROUTES
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Pricing = Loadable(lazy(() => import('../pages/Pricing')));
const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));
