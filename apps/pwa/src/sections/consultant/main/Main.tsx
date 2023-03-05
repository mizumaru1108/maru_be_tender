import { Grid } from '@mui/material';
import DailyStatistics from './DailyStatistics';
import IncomingConultationRequests from './IncomingConultationRequests';
import ProposalOnAmandement from './ProposalOnAmandement';

function Main() {
  return (
    <Grid container spacing={4}>
      <Grid item md={12}>
        <DailyStatistics />
      </Grid>
      <Grid item md={12}>
        <IncomingConultationRequests />
      </Grid>
      <Grid item md={12}>
        <ProposalOnAmandement />
      </Grid>
    </Grid>
  );
}

export default Main;
