import { lazy } from 'react';
import { Loadable } from './Loadable';
import GuestGuard from '../guards/GuestGuard';

const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const NewPassword = Loadable(lazy(() => import('../pages/auth/NewPassword')));

export const authRoute = {
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
  ],
};
