import { Grid } from '@mui/material';
import DailyStatistics from './DailyStatistics';
import IncomingConultationRequests from './IncomingConultationRequests';

function Main() {
  return (
    <Grid container spacing={4}>
      <Grid item md={12}>
        <DailyStatistics />
      </Grid>
      <Grid item md={12}>
        <IncomingConultationRequests />
      </Grid>
    </Grid>
  );
}

export default Main;
