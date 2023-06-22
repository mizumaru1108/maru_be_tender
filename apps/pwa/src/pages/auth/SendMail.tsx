// @mui
import { Box, Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// routes
// components
import Page from '../../components/Page';
// sections
import useLocales from 'hooks/useLocales';
import { useMemo, useState } from 'react';
import { SendMailForm } from 'sections/auth/send-email';
import Image from './background.jpg';
import { FEATURE_VERIFICATION_SIGN_UP } from 'config';
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

export default function SendMail() {
  const { translate, currentLang } = useLocales();
  const [timer, setTimer] = useState<number>(0);
  return (
    <Page title={translate('send_verify_email')}>
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
            {FEATURE_VERIFICATION_SIGN_UP ? <SendMailForm /> : <>Under Construction</>}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
