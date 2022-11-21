import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import Page from '../../components/Page';
import { RegisterForm } from 'sections/auth/register';
import useLocales from 'hooks/useLocales';
import Scrollbar from 'components/Scrollbar';
import Image from './background.jpg';
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
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
}));

// ----------------------------------------------------------------------

export default function Register() {
  const { translate } = useLocales();
  return (
    <Page title={translate('pages.auth.register')}>
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
        <Container>
          <Scrollbar
            sx={{
              height: 1,
              '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
              paddingLeft: '10px',
            }}
          >
            <ContentStyle>
              <RegisterForm />
            </ContentStyle>
          </Scrollbar>
        </Container>
      </RootStyle>
    </Page>
  );
}
