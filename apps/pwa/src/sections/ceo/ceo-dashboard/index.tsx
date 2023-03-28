import { Grid } from '@mui/material';
import DailyStatistics from './DailyStatistics';
import TrackBudget from './TrackBudget';
import DashboardProjectManagement from './ProjectManagement';
import ProposalOnAmandementTable from '../../../components/table/ceo/proposal-on-amandement/ProposalOnAmandementTable';

function CeoDashboard() {
  return (
    <>
      <Grid container spacing={5}>
        <Grid item md={12}>
          <DailyStatistics />
        </Grid>
        <Grid item md={12}>
          <TrackBudget />
        </Grid>
        <Grid item md={12}>
          <DashboardProjectManagement />
        </Grid>
        <Grid item md={12}>
          <ProposalOnAmandementTable />
        </Grid>
      </Grid>
    </>
  );
}

export default CeoDashboard;
