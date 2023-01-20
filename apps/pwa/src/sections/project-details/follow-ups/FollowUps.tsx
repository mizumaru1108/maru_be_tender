import { Grid, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import ClientFollowUpsPage from './ClientFollowUpsPage';
import EmployeeFollowUpsPage from './EmployeeFollowUpsPage';
import useLocales from 'hooks/useLocales';

function FollowUps() {
  const { activeRole } = useAuth();
  const { translate } = useLocales();

  return (
    <Grid container spacing={4}>
      <Grid item md={12} xs={12}>
        <Typography variant="h6">
          {translate('content.client.main_page.project_followups')}
        </Typography>
      </Grid>
      <Grid item md={12} xs={12}>
        {activeRole === 'tender_client' ? <ClientFollowUpsPage /> : <EmployeeFollowUpsPage />}
      </Grid>
    </Grid>
  );
}

export default FollowUps;
