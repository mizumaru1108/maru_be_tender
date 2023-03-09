import { Link as RouterLink } from 'react-router-dom';
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
import ForgotPasswordForm from '../../sections/auth/forgot-password/ForgotPasswordForm';
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

export default function ForgotPassword() {
  const { translate } = useLocales();

  return (
    <Page title={translate('pages.auth.forgot_password')}>
      <LogoOnlyLayout />

      <Container>
        <ContentStyle sx={{ textAlign: 'center', px: 4 }}>
          <Typography variant="h3" paragraph>
            {translate('pages.auth.forgot_password')}
          </Typography>

          <Typography sx={{ color: 'text.secondary', mb: 5 }}>
            {translate('reset_password_details_2')}
          </Typography>

          <ForgotPasswordForm />

          <Button
            fullWidth
            size="medium"
            variant="outlined"
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
