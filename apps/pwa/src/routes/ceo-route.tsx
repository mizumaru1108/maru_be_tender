import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';

const MainCeoPage = Loadable(lazy(() => import('pages/ceo/MainCeoPage')));

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
      path: 'dashboard',
      children: [
        { element: <Navigate to="/ceo/dashboard/app" replace />, index: true },
        { path: 'app', element: <MainCeoPage /> },
      ],
    },
  ],
};
