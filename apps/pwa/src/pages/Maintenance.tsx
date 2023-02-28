import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container } from '@mui/material';
// components
import Page from '../components/Page';
// assets
import { MaintenanceIllustration } from '../assets';
import useLocales from '../hooks/useLocales';

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

export default function Maintenance() {
  const { translate } = useLocales();
  return (
    // <Page title="Maintenance">
    <Page title={translate('pages.common.maintenance')}>
      <Container>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            Website currently under maintenance
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            We are currently working hard on this page!
          </Typography>

          <MaintenanceIllustration sx={{ my: 10, height: 240 }} />

          <Button variant="contained" size="large" component={RouterLink} to="/">
            Go to Home
          </Button>
        </ContentStyle>
      </Container>
    </Page>
  );
}
