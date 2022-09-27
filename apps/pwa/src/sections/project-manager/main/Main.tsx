import { Grid } from '@mui/material';
import DailyStatistics from './DailyStatistics';
import IncomingFundingRequests from './IncomingFundingRequests';
import ExchangePermission from './ExchangePermission';
import RequestsInProcess from './RequestsInProcess';
import TrackBudget from './TrackBudget';

function Main() {
  return (
    <Grid container>
      <Grid item md={12}>
        <DailyStatistics />
      </Grid>
      <Grid item md={12}>
        <TrackBudget />
      </Grid>
      <Grid item md={12}>
        <RequestsInProcess />
      </Grid>
      <Grid item md={12}>
        <IncomingFundingRequests />
      </Grid>
      <Grid item md={12}>
        <ExchangePermission />
      </Grid>
    </Grid>
  );
}

export default Main;
