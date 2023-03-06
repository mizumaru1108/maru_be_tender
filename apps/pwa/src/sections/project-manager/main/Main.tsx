import { Grid } from '@mui/material';
import DailyStatistics from './DailyStatistics';
import IncomingFundingRequests from './IncomingFundingRequests';
import ExchangePermission from './ExchangePermission';
import RequestsInProcess from './RequestsInProcess';
import TrackBudget from './TrackBudget';
import ProposalOnAmandement from './ProposalOnAmandement';

function Main() {
  return (
    <Grid container spacing={4}>
      <Grid item md={12}>
        <DailyStatistics />
      </Grid>
      <Grid item md={12}>
        <TrackBudget />
      </Grid>
      <RequestsInProcess />
      <IncomingFundingRequests />
      <ExchangePermission />
      <ProposalOnAmandement />
    </Grid>
  );
}

export default Main;
