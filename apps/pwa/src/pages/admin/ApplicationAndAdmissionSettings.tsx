import { Box, Container, styled, Typography } from '@mui/material';
import Page from 'components/Page';
import ApplicationAndAdmissionSettingsForm from 'sections/admin/application-and-admission-settings/ApplicationAndAdmissionSettingsForm';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function ApplicationAndAdmissionSettings() {
  return (
    <Page title="Application and Admission Settings">
      <Container>
        <ContentStyle>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
              إعدادات التقديم و القبول
            </Typography>
          </Box>
          <Box sx={{ px: '30px' }}>
            <ApplicationAndAdmissionSettingsForm />
          </Box>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default ApplicationAndAdmissionSettings;
