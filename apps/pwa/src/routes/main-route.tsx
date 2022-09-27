import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { Loadable } from './Loadable';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';

const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));

export const mainRoute = {
  path: '*',
  element: <LogoOnlyLayout />,
  children: [
    { path: 'coming-soon', element: <ComingSoon /> },
    { path: 'maintenance', element: <Maintenance /> },
    { path: '500', element: <Page500 /> },
    { path: '404', element: <Page404 /> },
    { path: '403', element: <Page403 /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ],
};
