import { m } from 'framer-motion';
// @mui
import { Box, Button, Container, Grid, Stack, styled, Typography } from '@mui/material';
// hooks
import useAuth from '../hooks/useAuth';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { ForbiddenIllustration } from '../assets';
import { FusionAuthRoles } from '../@types/commons';
//
import { ReactComponent as UnplugIcon } from '../assets/un_plug_icon.svg';
import Space from '../components/space/space';
import useLocales from '../hooks/useLocales';
import { useNavigate } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 1060,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

type RoleBasedGuardProp = {
  hasContent?: boolean;
  roles: FusionAuthRoles[];
  children: React.ReactNode;
};

export default function RoleBasedGuard({ hasContent, roles, children }: RoleBasedGuardProp) {
  // Logic here to get current user role
  const { user } = useAuth();
  const { translate } = useLocales();
  const navigate = useNavigate();

  const currentRoles = user?.registrations[0].roles; // admin;

  if (typeof roles !== 'undefined' && !currentRoles.find((role: any) => roles.includes(role))) {
    return hasContent ? (
      <ContentStyle>
        <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <m.div variants={varBounce().in}>
                {/* <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} /> */}
                <UnplugIcon style={{ height: '402.45px' }} />
              </m.div>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 10,
              }}
            >
              <Stack>
                <m.div variants={varBounce().in}>
                  <Typography
                    sx={{
                      fontFamily: 'Cairo',
                      fontWeight: 700,
                      fontSize: '96px',
                      textAlign: 'center',
                      color: 'primary.main',
                    }}
                  >
                    404
                  </Typography>
                </m.div>

                <m.div variants={varBounce().in}>
                  <Typography
                    sx={{
                      fontFamily: 'Cairo',
                      fontWeight: 700,
                      fontSize: '40px',
                      textAlign: 'center',
                    }}
                  >
                    {translate('pages.common.error_page.not_found')}
                  </Typography>
                </m.div>

                <m.div variants={varBounce().in}>
                  <Typography
                    sx={{
                      fontFamily: 'Cairo',
                      fontSize: '20px',
                      textAlign: 'center',
                    }}
                  >
                    {translate('pages.common.error_page.not_found_detail')}
                  </Typography>
                </m.div>

                <m.div variants={varBounce().in}>
                  <Space direction="horizontal" size="small" />
                  <Button to="/" variant="contained" sx={{ width: '180px' }} component={RouterLink}>
                    {translate('button.back_to_homepage')}
                  </Button>
                </m.div>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </ContentStyle>
    ) : null;
  }

  return <>{children}</>;
}
