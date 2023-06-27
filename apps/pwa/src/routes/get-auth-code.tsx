import AuthGuard from 'guards/AuthGuard';
import { lazy } from 'react';
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
