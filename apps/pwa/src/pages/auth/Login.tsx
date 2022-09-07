import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Link, Container, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';

// components
import Page from '../../components/Page';
import { ReactComponent as Logo } from '../../assets/logo.svg';
// sections
import { LoginForm } from '../../sections/auth/login';
import useLocales from 'hooks/useLocales';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    backgroundColor: theme.palette.background.neutral,
  },
}));

const SectionStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '500px',
  backgroundColor: theme.palette.background.paper,
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  padding: theme.spacing(5, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { translate } = useLocales();
  return (
    <Page title="Login">
      <RootStyle>
        <SectionStyle />
        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="column" alignItems="center">
              <Logo />
            </Stack>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontFamily: 'Cairo', color: 'text.secondary', mt: '10px' }}
            >
              {translate('login')}
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontFamily: 'Cairo', color: 'text.primary', fontSize: '16px' }}
            >
              {translate('the_login_message')}
            </Typography>
            <LoginForm />
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              {translate('dont_have_account')}
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                {translate('register_one')}
              </Link>
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
