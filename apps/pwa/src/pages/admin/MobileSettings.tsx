import { Box, Container, styled, Typography } from '@mui/material';
import Page from 'components/Page';
import MobileSettingsForm from 'sections/admin/mobile-settings/MobileSettingsForm';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function MobileSettings() {
  const { translate } = useLocales();
  return (
    // <Page title="Mobile Settings">
    <Page title={translate('pages.common.mobile_settings')}>
      <Container>
        <ContentStyle>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
              إعدادات الجوال
            </Typography>
          </Box>
          <Box sx={{ px: '30px' }}>
            <MobileSettingsForm />
          </Box>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MobileSettings;
