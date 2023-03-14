import { Grid } from '@mui/material';
import DailyStatistics from './DailyStatistics';
import IncomingAmandementRequest from './IncomingAmandementRequest';
import IncomingFundingRequests from './IncomingFundingRequests';
import PaymentAdjustment from './PaymentAdjustment';
import ProposalOnAmandement from './ProposalOnAmandement';
import RequestsInProcess from './RequestsInProcess';
import TrackBudget from './TrackBudget';
import IncomingCloseReport from './IncomingCloseReport';

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
      <PaymentAdjustment />
      <IncomingCloseReport />
      <ProposalOnAmandement />
      <IncomingAmandementRequest />
    </Grid>
  );
}

export default Main;
