import { Grid } from '@mui/material';
import DailyStatistics from './DailyStatistics';
import IncomingExchangePermissionRequests from './IncomingExchangePermissionRequests';
import RequestsInProcess from './RequestsInProcess';

function Main() {
  return (
    <Grid container spacing={4}>
      <Grid item md={12}>
        <DailyStatistics />
      </Grid>
      <Grid item md={12}>
        <IncomingExchangePermissionRequests />
      </Grid>
      <Grid item md={12}>
        <RequestsInProcess />
      </Grid>
    </Grid>
  );
}

export default Main;
