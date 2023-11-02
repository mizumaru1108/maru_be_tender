import { lazy } from 'react';
import { Navigate } from 'react-router';
// guards
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
// layout
import DashboardLayout from 'layouts/dashboard';
// component
import { Loadable } from './Loadable';
import CompleteCloseReports from 'pages/project-supervisor/CompleteCloseReports';
//
const NonClientProfile = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfile'))
);
const NonClientProfileEdit = Loadable(
  lazy(() => import('sections/non-client-profile/NonClientProfileEdit'))
);
const Searching = Loadable(lazy(() => import('pages/searching')));
const ProjectDetails = Loadable(lazy(() => import('pages/project-details/ProjectDetails')));
const MainAuditorReport = Loadable(lazy(() => import('pages/auditor-report/MainPage')));
const ProjectReportFinished = Loadable(lazy(() => import('pages/client/ProjectReportFinished')));
const ProjectOwnerDetails = Loadable(
  lazy(() => import('pages/project-details/ProjectOwnerDetails'))
);

export const auditorReportRoute = {
  path: 'auditor-report',
  element: (
    <AuthGuard>
      <RoleBasedGuard roles={['tender_auditor_report']} hasContent={true}>
        <DashboardLayout />
      </RoleBasedGuard>
    </AuthGuard>
  ),
  children: [
    { element: <Navigate to="/auditor-report/dashboard/app" replace />, index: true },
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
        { element: <Navigate to="/auditor-report/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainAuditorReport /> },
        {
          path: 'current-project',
          children: [
            { path: ':id/:actionType', element: <ProjectDetails /> },
            { path: 'owner/:submiterId', element: <ProjectOwnerDetails /> },
          ],
        },
        {
          path: 'complete-project-report',
          children: [
            { path: '', element: <CompleteCloseReports /> },
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
      ],
    },
  ],
};
