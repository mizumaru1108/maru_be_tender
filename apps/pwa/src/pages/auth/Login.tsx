import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Link, Container, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Page from '../../components/Page';
import { ReactComponent as Logo } from '../../assets/new_logo.svg';
// sections
import { LoginForm } from '../../sections/auth/login';
import useLocales from 'hooks/useLocales';
import Image from './background.jpg';
import { FEATURE_SIGNUP } from '../../config';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    backgroundColor: theme.palette.background.neutral,
    height: '100vh',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { translate } = useLocales();
  return (
    <Page title={translate('pages.auth.login')}>
      <RootStyle>
        <Box
          sx={{
            backgroundImage: `url(${Image})`,
            width: '100%',
            maxWidth: '600px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '100% 100%',
            objectFit: 'none',
            position: 'relative',
          }}
        />
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
              {translate('dont_have_account')}&nbsp;
              <Link
                variant="subtitle2"
                component={RouterLink}
                to={FEATURE_SIGNUP ? PATH_AUTH.register : '#'}
                sx={{ textDecorationLine: 'underline' }}
              >
                {translate('register_one')}
              </Link>
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
