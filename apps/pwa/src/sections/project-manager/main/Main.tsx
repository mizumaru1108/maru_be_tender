import { Grid } from '@mui/material';
import DailyStatistics from './DailyStatistics';
import ExchangePermission from './ExchangePermission';
import IncomingFundingRequests from './IncomingFundingRequests';
import RequestsInProcess from './RequestsInProcess';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
// urql + query
import Space from 'components/space/space';
import { getOneEmployee } from 'queries/admin/getAllTheEmployees';
import React from 'react';
import { getTrackList } from 'redux/slices/proposal';
import { getTracksById } from 'redux/slices/track';
import { dispatch, useSelector } from 'redux/store';
import EmployeeCarousel from 'sections/employee/carousel/EmployeeCarousel';
import TrackBudget from 'sections/project-supervisor/main/TrackBudget';
import { useQuery } from 'urql';

function Main() {
  const { translate } = useLocales();
  const { user, activeRole } = useAuth();
  const { isLoading: loadingTrack } = useSelector((state) => state.tracks);
  const { loadingCount } = useSelector((state) => state.proposal);

  const [{ data, fetching, error }] = useQuery({
    query: getOneEmployee,
    variables: { id: user?.id },
  });

  React.useEffect(() => {
    dispatch(getTrackList(1, activeRole! as string));
    if (data?.data?.track_id) {
      dispatch(getTracksById(activeRole!, data?.data?.track_id));
    }
  }, [activeRole, data?.data?.track_id]);

  if (loadingCount) return <>{translate('pages.common.loading')}</>;

  return (
    <Grid container spacing={4}>
      <Grid item md={12} xs={12}>
        <EmployeeCarousel />
      </Grid>
      <Grid item md={12}>
        <DailyStatistics />
      </Grid>
      <Grid item md={12}>
        {(loadingTrack || fetching) && !error && !data ? null : <TrackBudget />}
        {error && !fetching ? 'Oops something went wrong' : null}
      </Grid>
      <IncomingFundingRequests />
      <Space direction="horizontal" size="small" />
      <RequestsInProcess />
      <Space direction="horizontal" size="small" />
      <ExchangePermission />

      {/* <ProposalOnAmandement /> */}
    </Grid>
  );
}

export default Main;
