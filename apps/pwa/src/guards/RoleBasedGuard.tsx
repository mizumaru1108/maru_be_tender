import { m } from 'framer-motion';
// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useAuth from '../hooks/useAuth';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { ForbiddenIllustration } from '../assets';

// ----------------------------------------------------------------------
export type Role =
  | 'cluster_admin'
  | 'tender_accounts_manager'
  | 'tender_admin'
  | 'tender_ceo'
  | 'tender_cashier'
  | 'tender_client'
  | 'tender_consultant'
  | 'tender_finance'
  | 'tender_moderator'
  | 'tender_project_manager'
  | 'tender_project_supervisor';

type RoleBasedGuardProp = {
  hasContent?: boolean;
  roles: Role[];
  children: React.ReactNode;
};

export default function RoleBasedGuard({ hasContent, roles, children }: RoleBasedGuardProp) {
  // Logic here to get current user role
  const { user } = useAuth();

  // const currentRole = 'user';
  const currentRoles = user?.registrations[0].roles; // admin;

  if (typeof roles !== 'undefined' && !currentRoles.find((role: any) => roles.includes(role))) {
    console.log('asklansdklnasd');
    return hasContent ? (
      <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Permission Denied
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>
      </Container>
    ) : null;
  }

  return <>{children}</>;
}
