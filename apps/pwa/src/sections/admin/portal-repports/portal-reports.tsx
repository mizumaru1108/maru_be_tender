import { Grid, Stack, Typography } from '@mui/material';
import Space from 'components/space/space';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import React from 'react';
import PortalReportsForm from 'sections/admin/portal-repports/portal-report-form';

export default function AdminPortalReportsPage() {
  const { translate } = useLocales();
  return (
    <Grid>
      <Grid item md={12}>
        <Stack>
          <Typography
            variant="h4"
            sx={{
              maxWidth: '700px',
            }}
          >
            {/* Create a project report */}
            {translate('portal_report.header_page')}
          </Typography>
        </Stack>
        <Stack>
          <Typography sx={{ color: '#1E1E1E', fontSize: '15px', mt: '5px' }}>
            {/* Please select the sections to be inquired in order to display the information accurately */}
            {translate('portal_report.description')}
          </Typography>
        </Stack>
        <Space direction="horizontal" size="small" />
      </Grid>

      <Grid item md={12}>
        <PortalReportsForm />
      </Grid>
    </Grid>
  );
}
