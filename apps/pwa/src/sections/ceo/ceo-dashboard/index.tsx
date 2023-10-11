import { Grid } from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { getTrackList } from 'redux/slices/proposal';
import { dispatch, useSelector } from 'redux/store';
import TrackBudget from 'sections/admin/main/TrackBudget';
import EmployeeCarousel from 'sections/employee/carousel/EmployeeCarousel';
import DailyStatistics from './DailyStatistics';
import DashboardProjectManagement from './ProjectManagement';

function CeoDashboard() {
  const { translate } = useLocales();

  const { activeRole } = useAuth();
  const { loadingCount } = useSelector((state) => state.proposal);
  React.useEffect(() => {
    dispatch(getTrackList(0, activeRole! as string, 0));
  }, [activeRole]);

  if (loadingCount) return <>{translate('pages.common.loading')}</>;

  return (
    <>
      <Grid container spacing={5}>
        <Grid item md={12} xs={12}>
          <EmployeeCarousel />
        </Grid>
        <Grid item md={12}>
          <DailyStatistics />
        </Grid>
        <Grid item md={12}>
          <TrackBudget />
        </Grid>
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
