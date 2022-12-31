import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';

const MainProjectManager = Loadable(lazy(() => import('pages/project-manager/MainPage')));
const IncomingFundingRequestsProjectManager = Loadable(
  lazy(() => import('pages/project-manager/IncomingFundingRequests'))
);
const RequestsInProcessProjectManager = Loadable(
  lazy(() => import('pages/project-manager/RequestsInProcess'))
);
const PreviousFundingRequestsProjectManager = Loadable(
  lazy(() => import('pages/project-manager/PreviousFundingRequests'))
);
const PortalReportsProjectManager = Loadable(lazy(() => import('pages/PortalReports')));
const MessagesProjectManager = Loadable(lazy(() => import('pages/project-manager/Messages')));
const ExchangePermissionProjectManager = Loadable(
  lazy(() => import('pages/project-manager/ExchangePermission'))
);
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));
const AppointmentsWithPartners = Loadable(
  lazy(() => import('pages/project-manager/AppointmentsWithPartners'))
);
const AmandementRequest = Loadable(
  lazy(() => import('pages/amandement-request/AmandementRequest'))
);

const NonClientProfile = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfile'))
);
const NonClientProfileEdit = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfileEdit'))
);
const Searching = Loadable(lazy(() => import('pages/searching')));
const BookingAMeeting = Loadable(lazy(() => import('pages/project-manager/BookingAMeeting')));

const CeoRejectionListPage = Loadable(lazy(() => import('pages/ceo/CeoRejectionListPage')));

export const projectManagerRoute = {
  path: 'project-manager',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_project_manager']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    { element: <Navigate to="/project-manager/dashboard/app" replace />, index: true },
    {
      path: 'my-profile',
      children: [
        { path: '', element: <NonClientProfile /> },
        { path: 'edit', element: <NonClientProfileEdit /> },
      ],
    },
    {
      path: 'searching',
      children: [
        { path: '', element: <Searching /> },
        {
          path: ':id/amandementRequest',
          element: <AmandementRequest />,
        },
      ],
    },
    {
      path: 'dashboard',
      children: [
        { element: <Navigate to="/project-manager/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainProjectManager /> },
        {
          path: 'incoming-funding-requests',
          children: [
            { path: '', element: <IncomingFundingRequestsProjectManager /> },
            {
              path: ':id/amandementRequest',
              element: <AmandementRequest />,
            },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        {
          path: 'requests-in-process',
          children: [
            { path: '', element: <RequestsInProcessProjectManager /> },
            {
              path: ':id/amandementRequest',
              element: <AmandementRequest />,
            },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },

        {
          path: 'rejection-list',
          children: [
            { path: '', element: <CeoRejectionListPage /> },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        {
          path: 'previous-funding-requests',
          children: [
            { path: '', element: <PreviousFundingRequestsProjectManager /> },
            {
              path: ':id/amandementRequest',
              element: <AmandementRequest />,
            },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        {
          path: 'exchange-permission',
          children: [
            { path: '', element: <ExchangePermissionProjectManager /> },
            {
              path: ':id/amandementRequest',
              element: <AmandementRequest />,
            },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        { path: 'portal-reports', element: <PortalReportsProjectManager /> },
        { path: 'messages', element: <MessagesProjectManager /> },
        {
          path: 'appointments-with-partners',
          children: [
            { path: '', element: <AppointmentsWithPartners /> },
            { path: 'booking', element: <BookingAMeeting /> },
          ],
        },
      ],
    },
  ],
};
