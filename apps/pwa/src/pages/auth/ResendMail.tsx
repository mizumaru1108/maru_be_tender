// @mui
import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
// routes
// components
import Page from '../../components/Page';
// sections
import useLocales from 'hooks/useLocales';
import { SendMailForm } from 'sections/auth/send-email';
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
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
}));

// ----------------------------------------------------------------------

export default function ResendMail() {
  const { translate } = useLocales();
  return (
    <Page title={translate('pages.common.resend_verify_email')}>
      <RootStyle>
        <Box
          data-cy="side-background-image"
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
        <Container maxWidth="md">
          <ContentStyle>
            <SendMailForm isResend />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
