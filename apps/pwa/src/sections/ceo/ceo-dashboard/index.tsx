import { Grid } from '@mui/material';
import DailyStatistics from './DailyStatistics';
import TrackBudget from './TrackBudget';
import DashboardProjectManagement from './ProjectManagement';
import ProposalOnAmandementTable from '../../../components/table/ceo/proposal-on-amandement/ProposalOnAmandementTable';
import { dispatch, useSelector } from 'redux/store';
import { useEffect } from 'react';
import { getTrackList } from 'redux/slices/proposal';
import useAuth from 'hooks/useAuth';

function CeoDashboard() {
  const { isLoading } = useSelector((state) => state.proposal);
  const activeRole = useAuth();
  const role = activeRole!.activeRole;
  useEffect(() => {
    dispatch(getTrackList(0, role as string));
  }, [activeRole, role]);
  if (isLoading) return <>Loading</>;
  return (
    <>
      <Grid container spacing={5}>
        <Grid item md={12}>
          <DailyStatistics />
        </Grid>
        {/* <Grid item md={12}>
          <TrackBudget />
        </Grid> */}
        <Grid item md={12}>
          <DashboardProjectManagement />
        </Grid>
        {/* <Grid item md={12}>
          <ProposalOnAmandementTable />
        </Grid> */}
      </Grid>
    </>
  );
}

export default CeoDashboard;
