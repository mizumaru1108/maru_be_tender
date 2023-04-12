import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import AuthGuard from 'guards/AuthGuard';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import { Loadable } from './Loadable';

const GetAuth = Loadable(lazy(() => import('pages/project-supervisor/GetAuthCode')));

export const getAuthCode = {
  path: 'tender-appointment/google-callback',
  element: (
    <AuthGuard>
      <GetAuth />
    </AuthGuard>
  ),
};
