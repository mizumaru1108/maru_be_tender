import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';
import { FEATURE_MENU_CLIENT_FILES } from 'config';

const MainFinance = Loadable(lazy(() => import('pages/finance/MainPage')));
const IncomingExchangePermissionRequestsFinance = Loadable(
  lazy(() => import('pages/finance/IncomingExchangePermissionRequests'))
);
const IncomingExchangePermissionRequestsFinanceWithVat = Loadable(
  lazy(() => import('pages/finance/IncomingExchangePermissionRequestsWithVat'))
);
const RequestsInProcessFinance = Loadable(lazy(() => import('pages/finance/RequestsInProcess')));
const RequestsInProcessFinanceWithVat = Loadable(
  lazy(() => import('pages/finance/RequestsInProcessWithVat'))
);
const PortalReportsFinance = Loadable(lazy(() => import('pages/PortalReports')));
const MessagesFinance = Loadable(lazy(() => import('pages/finance/Messages')));
const OldProposal = Loadable(lazy(() => import('pages/finance/OldProposal')));
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
const PreviousFundingRequestsFinance = Loadable(
  lazy(() => import('pages/finance/PreviousFundingRequests'))
);

const ProjectReportFinished = Loadable(lazy(() => import('pages/client/ProjectReportFinished')));
const PreviewPayment = Loadable(lazy(() => import('sections/finance/payment/PreviewPayment')));
const ProjectPreview = Loadable(lazy(() => import('pages/ProposalPrintPreview')));

export const financeRoute = {
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
        { element: <Navigate to="/finance/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainFinance /> },
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
            { path: '', element: <IncomingExchangePermissionRequestsFinance /> },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        // {
        //   path: 'incoming-exchange-permission-requests-with-vat',
        //   children: [
        //     { path: '', element: <IncomingExchangePermissionRequestsFinanceWithVat /> },
        //     {
        //       path: ':id/:actionType',
        //       element: <ProjectDetails />,
        //     },
        //   ],
        // },
        {
          path: 'requests-in-process',
          children: [
            { path: '', element: <RequestsInProcessFinance /> },
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
          path: 'requests-in-process-with-vat',
          children: [
            { path: '', element: <RequestsInProcessFinanceWithVat /> },
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
          path: 'previous-funding-requests',
          children: [
            { path: '', element: <PreviousFundingRequestsFinance /> },
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
        { path: 'portal-reports', element: <PortalReportsFinance /> },
        { path: 'messages', element: <MessagesFinance /> },
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
