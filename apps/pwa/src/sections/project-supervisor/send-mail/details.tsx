import { Button, Grid, Stack, Typography } from '@mui/material';
import Iconify from 'components/Iconify';
import Space from 'components/space/space';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { EmailToClient } from '../../../components/table/send-email/types';
import useAuth from '../../../hooks/useAuth';
import axiosInstance from '../../../utils/axios';
import { FormSendEmail } from './form';

export default function DetailsEmail() {
  const { translate, currentLang } = useLocales();
  const params = useParams();
  const navigate = useNavigate();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [detailsEmail, setDetailEmails] = useState<EmailToClient>();

  const id = (params?.email_record_id as string) || '';

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchingData = useCallback(async () => {
    const url = `/tender/email-records/${id}`;
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(url, {
        headers: { 'x-hasura-role': activeRole! },
        params: {
          include_relations: 'sender',
        },
      });
      console.log({ res });
      if (res.data.data) {
        setDetailEmails(res.data.data);
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enqueueSnackbar, activeRole]);

  React.useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  if (isLoading) return <>{translate('pages.common.loading')}</>;

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
            {detailsEmail?.title ? detailsEmail?.title : translate('email_to_client.email')}
          </Typography>
        </Stack>
        <Space direction="horizontal" size="medium" />
      </Grid>

      <Grid item md={12}>
        test
      </Grid>
    </Grid>
  );
}
