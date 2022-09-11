import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import Page from '../../components/Page';
import { RegisterForm } from 'sections/auth/register';
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
    <Page title="Register">
      <RootStyle>
        <SectionStyle />
        <Container>
          <ContentStyle>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontFamily: 'Cairo', fontStyle: 'Bold', mt: 5 }}
              >
                {translate('create_new_account')}
              </Typography>
            </Box>
            <RegisterForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
