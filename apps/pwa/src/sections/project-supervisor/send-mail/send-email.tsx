import { Button, Grid, Stack, Typography } from '@mui/material';
import Iconify from 'components/Iconify';
import Space from 'components/space/space';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import SendEmailActionBox from 'sections/project-supervisor/send-mail/action-box';
import axiosInstance from 'utils/axios';
import { role_url_map } from '../../../@types/commons';
import { BaseAttachement } from '../../../@types/proposal';
import useAuth from '../../../hooks/useAuth';
import { getClientList } from '../../../redux/slices/proposal';
import { dispatch } from '../../../redux/store';
import { removeEmptyKey } from '../../../utils/remove-empty-key';
import SendEmailForm, { FormSendEmail } from './form';

export default function SendEmail() {
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmitGeneralForm = async (data: FormSendEmail) => {
    const url = '/tender/email-records/create';
    let formData = new FormData();

    const payload = removeEmptyKey({ ...data });
    delete payload.attachments;

    for (const key in payload) {
      formData.append(key, payload[key]);
    }
    if (data?.attachments?.file && data?.attachments?.file[0]) {
      formData.append('attachments', data?.attachments?.file[0] as Blob);
    }
    try {
      setIsLoading(true);
      const res = await axiosInstance.post(url, formData, {
        headers: { 'x-hasura-role': activeRole! },
      });
      enqueueSnackbar(translate('email_to_client.snack.success_send_email'), {
        variant: 'success',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });
      navigate(`/${role_url_map[`${activeRole!}`]}/dashboard/send-email`);
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

  React.useEffect(() => {
    dispatch(getClientList(activeRole as string));
  }, [activeRole]);

  return (
    <Grid>
      <Grid item md={12}>
        <Stack sx={{ displat: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Button
            color="inherit"
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{ p: 1, minWidth: 35, minHeight: 35, mr: 3 }}
          >
            <Iconify
              icon={
                currentLang.value === 'en'
                  ? 'eva:arrow-ios-back-outline'
                  : 'eva:arrow-ios-forward-outline'
              }
              width={35}
              height={35}
            />
          </Button>
          <Typography
            variant="h4"
            sx={{
              maxWidth: '700px',
            }}
          >
            {translate('email_to_client.new_email')}
          </Typography>
        </Stack>
        <Space direction="horizontal" size="medium" />
      </Grid>

      <Grid item md={12}>
        <SendEmailForm
          onSubmitForm={(data) => {
            handleSubmitGeneralForm(data);
          }}
          isLoading={isLoading}
        >
          {/* test */}
          <SendEmailActionBox onReturn={() => console.log('test')} isLoad={false} />
        </SendEmailForm>
        {/* test */}
      </Grid>
    </Grid>
  );
}
