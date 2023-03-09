import { Link as RouterLink, useLocation } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Container, Typography } from '@mui/material';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Page from '../../components/Page';
// sections
import { ResetPasswordForm } from '../../sections/auth/reset-password';
import useLocales from 'hooks/useLocales';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ResetPassword() {
  const { translate } = useLocales();
  const location = useLocation();

  return (
    // <Page title="Reset Password">
    <Page title={translate('pages.auth.reset_password')}>
      <LogoOnlyLayout />

      <Container>
        <ContentStyle sx={{ textAlign: 'center' }}>
          <Typography variant="h3" paragraph>
            {translate('forgot_your_password')}
          </Typography>

          <Typography sx={{ color: 'text.secondary', mb: 5 }}>
            {translate('forgot_password_details')}
          </Typography>

          <ResetPasswordForm />

          <Button
            fullWidth
            size="medium"
            component={RouterLink}
            to={PATH_AUTH.login}
            sx={{ mt: 1 }}
          >
            {translate('going_back_one_step')}
          </Button>
        </ContentStyle>
      </Container>
    </Page>
  );
}
