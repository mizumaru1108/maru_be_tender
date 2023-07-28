import { Grid } from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { getOneEmployee } from 'queries/admin/getAllTheEmployees';
import React from 'react';
import { getTrackList } from 'redux/slices/proposal';
import { dispatch, useSelector } from 'redux/store';
import EmployeeCarousel from 'sections/employee/carousel/EmployeeCarousel';
import TrackBudget from 'sections/finance/main/TrackBudget';
import { useQuery } from 'urql';
import DailyStatistics from './DailyStatistics';
import IncomingExchangePermissionRequests from './IncomingExchangePermissionRequests';
import RequestsInProcess from './RequestsInProcess';

function Main() {
  // const { user } = useAuth();

  // const [{ data, fetching, error }] = useQuery({
  //   query: getOneEmployee,
  //   variables: { id: user?.id },
  // });

  // if (fetching) return <>{translate('pages.common.loading')}</>;
  // if (error) return <>{error.message}</>;'
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { loadingCount } = useSelector((state) => state.proposal);
  React.useEffect(() => {
    dispatch(getTrackList(1, activeRole! as string));
  }, [activeRole]);

  if (loadingCount) return <>{translate('pages.common.loading')}</>;
  return (
    <Grid container spacing={4}>
      <Grid item md={12} xs={12}>
        <EmployeeCarousel />
      </Grid>
      <Grid item md={12}>
        <DailyStatistics />
      </Grid>
      {/* <Grid item md={12}>
        <TrackBudget path={data.data.employee_path} track_id={data.data.track_id} />
      </Grid> */}
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
