import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';
import ProjectOwnerDetailsMainPage from 'sections/project-details/project-owner-details/ProjectOwnerDetailsMainPage';

const MainCeoPage = Loadable(lazy(() => import('pages/ceo/MainCeoPage')));
const CeoMessagePage = Loadable(lazy(() => import('pages/ceo/CeoMessagePage')));
const CeoProjectManagementPage = Loadable(lazy(() => import('pages/ceo/CeoProjectManagementPage')));
const CeoRejectionListPage = Loadable(lazy(() => import('pages/ceo/CeoRejectionListPage')));
const CeoClientListPage = Loadable(lazy(() => import('pages/ceo/CeoClientListPage')));
const CeoPortalReportPage = Loadable(lazy(() => import('pages/PortalReports')));
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));
const ProjectOwnerDetails = Loadable(
  lazy(() => import('pages/project-details/ProjectOwnerDetails'))
);
const PreviousFundingRequestsCeo = Loadable(
  lazy(() => import('pages/ceo/PreviousFundingRequests'))
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

export const ceoRoute = {
  path: 'ceo',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_ceo']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    { element: <Navigate to="/ceo/dashboard/app" replace />, index: true },
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
        { element: <Navigate to="/ceo/dashboard/app" replace />, index: true },
        { path: ':submiterId/:detailType', element: <ProjectOwnerDetails /> },
        {
          path: 'amandment-request/:id',
          element: <AmandementRequest />,
        },
        {
          path: 'current-project',
          children: [
            { path: ':id/:actionType', element: <ProjectDetails /> },

            { path: 'owner/:submiterId', element: <ProjectOwnerDetails /> },
          ],
        },
        {
          path: 'app',
          children: [
            {
              path: '',
              element: <MainCeoPage />,
            },
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        {
          path: 'project-management',
          children: [
            {
              path: '',
              element: <CeoProjectManagementPage />,
            },
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
            {
              path: '',
              element: <CeoRejectionListPage />,
            },
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
            {
              path: ':id/:actionType',
              element: <ProjectDetails />,
            },
          ],
        },
        {
          path: 'previous-funding-requests',
          children: [
            { path: '', element: <PreviousFundingRequestsCeo /> },
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
        // { path: 'client-list', element: <CeoClientListPage /> },
        { path: 'portal-reports', element: <CeoPortalReportPage /> },
        { path: 'messages', element: <CeoMessagePage /> },
      ],
    },
  ],
};
