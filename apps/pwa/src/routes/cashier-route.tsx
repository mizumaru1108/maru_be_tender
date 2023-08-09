import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';
import { FEATURE_MENU_CLIENT_FILES } from 'config';

const MainCashier = Loadable(lazy(() => import('pages/cashier/MainPage')));
const IncomingExchangePermissionRequestsCashier = Loadable(
  lazy(() => import('pages/cashier/IncomingExchangePermissionRequests'))
);
const RequestsInProcessCashier = Loadable(lazy(() => import('pages/cashier/RequestsInProcess')));
const PortalReportsCashier = Loadable(lazy(() => import('pages/PortalReports')));
const MessagesCashier = Loadable(lazy(() => import('pages/cashier/Messages')));
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));
const ProjectOwnerDetails = Loadable(
  lazy(() => import('pages/project-details/ProjectOwnerDetails'))
);

const NonClientProfile = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfile'))
);
const NonClientProfileEdit = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfileEdit'))
);
const Searching = Loadable(lazy(() => import('pages/searching')));
const AmandementRequest = Loadable(
  lazy(() => import('pages/amandement-request/AmandementRequest'))
);
const PreviousFundingRequestsCashier = Loadable(
  lazy(() => import('pages/cashier/PreviousFundingRequests'))
);

const ProjectReportFinished = Loadable(lazy(() => import('pages/client/ProjectReportFinished')));
const OldProposal = Loadable(lazy(() => import('pages/cashier/OldProposal')));
const ClientFiles = Loadable(lazy(() => import('pages/client-files/ClientFiles')));
const PreviewPayment = Loadable(lazy(() => import('sections/finance/payment/PreviewPayment')));
const ProjectPreview = Loadable(lazy(() => import('pages/ProposalPrintPreview')));

export const cashierRoute = {
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
        { element: <Navigate to="/cashier/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainCashier /> },
        { path: 'amandement-request/:id', element: <AmandementRequest /> },
        { path: ':submiterId/:detailType', element: <ProjectOwnerDetails /> },
        {
          path: 'current-project',
          children: [
            { path: ':id/:actionType', element: <ProjectDetails /> },
            { path: 'preview/:id', element: <ProjectPreview /> },
            { path: 'owner/:submiterId', element: <ProjectOwnerDetails /> },
          ],
        },
        {
          path: 'incoming-exchange-permission-requests',
          children: [
            { path: '', element: <IncomingExchangePermissionRequestsCashier /> },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        {
          path: 'requests-in-process',
          children: [
            { path: '', element: <RequestsInProcessCashier /> },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        {
          path: 'previous-funding-requests',
          children: [
            { path: '', element: <PreviousFundingRequestsCashier /> },
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
        { path: 'portal-reports', element: <PortalReportsCashier /> },
        { path: 'messages', element: <MessagesCashier /> },
        {
          path: 'old-proposal',
          element: <OldProposal />,
        },
        FEATURE_MENU_CLIENT_FILES && {
          path: 'client-files',
          element: <ClientFiles />,
        },

        {
          path: 'generate/:id/payments/:paymentId',
          element: <PreviewPayment />,
        },
      ],
    },
  ],
};
