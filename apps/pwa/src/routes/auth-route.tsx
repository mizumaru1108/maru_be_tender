import { lazy } from 'react';
import { Loadable } from './Loadable';
import GuestGuard from '../guards/GuestGuard';
import { Navigate } from 'react-router-dom';

const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const SendMail = Loadable(lazy(() => import('../pages/auth/SendMail')));
const ResendMail = Loadable(lazy(() => import('../pages/auth/ResendMail')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyRegisterCode')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const ForgotPassword = Loadable(lazy(() => import('../pages/auth/ForgotPassword')));
const NewResetPassword = Loadable(lazy(() => import('../pages/auth/NewResetPassword')));
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
    {
      path: 'verify/:code',
      element: <VerifyCode />,
    },
    {
      path: 'send-email',
      children: [
        {
          path: '',
          element: (
            <GuestGuard>
              <ResendMail />
            </GuestGuard>
          ),
        },
        {
          path: ':email',
          element: (
            <GuestGuard>
              <SendMail />
            </GuestGuard>
          ),
        },
      ],
    },
    { path: 'login-unprotected', element: <Login /> },
    { path: 'register-unprotected', element: <Register /> },
    {
      path: 'reset-password',
      children: [
        { path: '', element: <ResetPassword /> },
        {
          path: ':id',
          element: <NewResetPassword />,
        },
      ],
    },
    {
      path: 'forgot-password',
      children: [
        { path: '', element: <ResetPassword /> },
        // { path: '', element: <Navigate to="/auth/login" replace /> },
        {
          path: ':id',
          element: <ForgotPassword />,
        },
      ],
    },
    { path: 'new-password', element: <NewPassword /> },
  ],
};
