import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import LoadingScreen from '../components/LoadingScreen';
import { clientRoute } from './client-route';
import { consultantRoute } from './consultant-route';
import { moderatorRoute } from './moderator-route';
import { financeRoute } from './finance-route';
import { projectSupervisorRoute } from './project-supervisor-route';
import { projectManagerRoute } from './project-manager-route';
import { cashierRoute } from './cashier-route';
import { authRoute } from './auth-route';
import { accoutsManagerRoute } from './accounts-manager-route';
import { ceoRoute } from './ceo-route';
import { mainRoute } from './main-route';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    authRoute,
    clientRoute,
    moderatorRoute,
    consultantRoute,
    accoutsManagerRoute,
    financeRoute,
    cashierRoute,
    projectSupervisorRoute,
    projectManagerRoute,
    ceoRoute,
    mainRoute,
    {
      path: '/',
      element: <Navigate to={'/auth/login'} replace />,
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
