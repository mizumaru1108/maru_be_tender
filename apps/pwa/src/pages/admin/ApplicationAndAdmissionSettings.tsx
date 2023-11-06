import { Box, Container, styled, Typography } from '@mui/material';
import Page from 'components/Page';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import ApplicationAndAdmissionSettingsForm from 'sections/admin/application-and-admission-settings/ApplicationAndAdmissionSettingsForm';
import { AdmissionProps } from '../../@types/commons';
import useAuth from '../../hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import { getApplicationAdmissionSettings } from '../../redux/slices/applicationAndAdmissionSettings';
import { dispatch } from '../../redux/store';
import axiosInstance from '../../utils/axios';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function ApplicationAndAdmissionSettings() {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: AdmissionProps) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.patch('/tender/proposal/configs/update', data, {
        headers: { 'x-hasura-role': activeRole! },
      });
      enqueueSnackbar(translate('application_and_admission_settings_form.snackbar.success'), {
        variant: 'success',
        preventDuplicate: true,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
      dispatch(getApplicationAdmissionSettings(activeRole!));
    } catch (error) {
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <Page title="Application and Admission Settings">
    <Page title={translate('pages.admin.application_and_admission')}>
      <Container>
        <ContentStyle>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
              {translate('pages.common.application_and_admission_settings')}
            </Typography>
          </Box>
          <Box sx={{ px: '30px' }}>
            <ApplicationAndAdmissionSettingsForm onSubmit={handleSubmit} isLoading={isLoading} />
          </Box>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default ApplicationAndAdmissionSettings;
