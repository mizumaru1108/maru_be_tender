import { lazy } from 'react';
import { Loadable } from './Loadable';

const Landing = Loadable(lazy(() => import('../pages/landing/landing')));

export const landingRoute = {
  path: 'landing',
  children: [{ path: '', element: <Landing /> }],
};
