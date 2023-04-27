import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';
import CeoClientListPage from 'pages/ceo/CeoClientListPage';

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
const OldProposal = Loadable(lazy(() => import('pages/project-manager/OldProposal')));
const ClientFiles = Loadable(lazy(() => import('pages/client-files/ClientFiles')));
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));
const ProjectOwnerDetails = Loadable(
  lazy(() => import('pages/project-details/ProjectOwnerDetails'))
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

const CeoRejectionListPage = Loadable(lazy(() => import('pages/project-manager/RejectionList')));

const ProjectReportFinished = Loadable(lazy(() => import('pages/client/ProjectReportFinished')));

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
          path: ':id/:actionType',
          element: <ProjectDetails />,
        },
      ],
    },
    {
      path: 'dashboard',
      children: [
        { element: <Navigate to="/project-manager/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainProjectManager /> },
        { path: 'amandment-request/:id', element: <AmandementRequest /> },
        { path: ':submiterId/:detailType', element: <ProjectOwnerDetails /> },
        {
          path: 'current-project',
          children: [
            { path: ':id/:actionType', element: <ProjectDetails /> },

            { path: 'owner/:submiterId', element: <ProjectOwnerDetails /> },
          ],
        },
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
          path: 'client-list',
          children: [
            {
              path: '',
              element: <CeoClientListPage />,
            },
            {
              path: 'owner/:submiterId',
              element: <ProjectOwnerDetails />,
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
          path: 'project-report',
          children: [
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
            {
              path: ':id/:actionType/finished',
              element: <ProjectReportFinished />,
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
          path: 'old-proposal',
          element: <OldProposal />,
        },
        {
          path: 'client-files',
          element: <ClientFiles />,
        },

        // {
        //   path: 'appointments-with-partners',
        //   children: [
        //     { path: '', element: <AppointmentsWithPartners /> },
        //     { path: 'booking', element: <BookingAMeeting /> },
        //   ],
        // },
      ],
    },
  ],
};
