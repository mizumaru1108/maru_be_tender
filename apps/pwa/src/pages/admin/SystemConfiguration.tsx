import { Box, Container, styled, Typography } from '@mui/material';
import Page from 'components/Page';
import SystemConfiqurationForm from 'sections/admin/system-confiquration/SystemConfiqurationForm';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function SystemConfiguration() {
  const { translate } = useLocales();
  return (
    // <Page title="System Configuration">
    <Page title={translate('pages.admin.system_configuration')}>
      <Container>
        <ContentStyle>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
              إعدادات النظام
            </Typography>
          </Box>
          <Box sx={{ px: '30px' }}>
            <SystemConfiqurationForm />
          </Box>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default SystemConfiguration;
