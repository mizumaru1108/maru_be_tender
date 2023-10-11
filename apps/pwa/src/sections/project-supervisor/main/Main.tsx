// component
import { Grid } from '@mui/material';
import DailyStatistics from './DailyStatistics';
import IncomingAmandementRequest from './IncomingAmandementRequest';
import IncomingCloseReport from './IncomingCloseReport';
import IncomingFundingRequests from './IncomingFundingRequests';
import PaymentAdjustment from './PaymentAdjustment';
import ProposalOnAmandement from './ProposalOnAmandement';
import RequestsInProcess from './RequestsInProcess';
import TrackBudget from './TrackBudget';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
// urql + query
import Space from 'components/space/space';
import { getUserData } from 'queries/commons/getUserData';
import React from 'react';
import { getTrackList } from 'redux/slices/proposal';
import { getTracksById } from 'redux/slices/track';
import { dispatch, useSelector } from 'redux/store';
import EmployeeCarousel from 'sections/employee/carousel/EmployeeCarousel';
import { useQuery } from 'urql';
import { FEATURE_AMANDEMENT_FROM_FINANCE } from '../../../config';
import { getOneEmployee } from 'queries/admin/getAllTheEmployees';

function Main() {
  const { translate } = useLocales();
  const { user } = useAuth();
  // console.log({ user });
  const { isLoading: loadingTrack } = useSelector((state) => state.tracks);

  const [result] = useQuery({
    query: getOneEmployee,
    variables: { id: user?.id },
  });
  const { data, fetching, error } = result;

  const { activeRole } = useAuth();
  const { loadingCount } = useSelector((state) => state.proposal);
  React.useEffect(() => {
    dispatch(getTrackList(1, activeRole! as string));
    if (data?.data?.track_id) {
      dispatch(getTracksById(activeRole!, data?.data?.track_id || ''));
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
      <PaymentAdjustment />
      <Space direction="horizontal" size="small" />
      <IncomingCloseReport />
      <Space direction="horizontal" size="small" />

      <ProposalOnAmandement />
      <Space direction="horizontal" size="small" />
      {FEATURE_AMANDEMENT_FROM_FINANCE ? <IncomingAmandementRequest /> : null}
    </Grid>
  );
}

export default Main;
