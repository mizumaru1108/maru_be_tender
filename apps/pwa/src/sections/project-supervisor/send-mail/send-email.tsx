import { Button, Grid, Stack, Typography } from '@mui/material';
import Iconify from 'components/Iconify';
import Space from 'components/space/space';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useNavigate } from 'react-router';
import PortalReportsForm from 'sections/admin/portal-repports/portal-report-form';
import useAuth from '../../../hooks/useAuth';
import { getClientList } from '../../../redux/slices/proposal';
import { dispatch } from '../../../redux/store';
import SendEmailForm from './form';

export default function SendEmail() {
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();
  const { activeRole } = useAuth();

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
            console.log({ data });
          }}
        >
          test
        </SendEmailForm>
        {/* test */}
      </Grid>
    </Grid>
  );
}
