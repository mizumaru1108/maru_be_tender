// component
import { Grid } from '@mui/material';
import DailyStatistics from './DailyStatistics';
import IncomingAmandementRequest from './IncomingAmandementRequest';
import IncomingFundingRequests from './IncomingFundingRequests';
import PaymentAdjustment from './PaymentAdjustment';
import ProposalOnAmandement from './ProposalOnAmandement';
import RequestsInProcess from './RequestsInProcess';
import TrackBudget from './TrackBudget';
import IncomingCloseReport from './IncomingCloseReport';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
// urql + query
import { useQuery } from 'urql';
import { getOneEmployee } from 'queries/admin/getAllTheEmployees';
import React from 'react';
import { useSnackbar } from 'notistack';
import { dispatch, useSelector } from 'redux/store';
import { getTrackList } from 'redux/slices/proposal';
import EmployeeCarousel from 'sections/employee/carousel/EmployeeCarousel';
import { FEATURE_AMANDEMENT_FROM_FINANCE } from '../../../config';

function Main() {
  const { translate } = useLocales();
  const { user } = useAuth();

  const [{ data, fetching, error }] = useQuery({
    query: getOneEmployee,
    variables: { id: user?.id },
  });

  const { activeRole } = useAuth();
  const { loadingCount } = useSelector((state) => state.proposal);
  React.useEffect(() => {
    dispatch(getTrackList(1, activeRole! as string));
  }, [activeRole]);

  if (fetching || loadingCount) return <>{translate('pages.common.loading')}</>;
  if (error) return <>{error.message}</>;

  return (
    <Grid container spacing={4}>
      <Grid item md={12} xs={12}>
        <EmployeeCarousel />
      </Grid>
      <Grid item md={12}>
        <DailyStatistics />
      </Grid>
      <Grid item md={12}>
        <TrackBudget path={data.data.employee_path} track_id={data.data.track_id} />
      </Grid>
      <IncomingFundingRequests />
      <RequestsInProcess />
      <PaymentAdjustment />
      <IncomingCloseReport />
      <ProposalOnAmandement />
      {FEATURE_AMANDEMENT_FROM_FINANCE ? <IncomingAmandementRequest /> : null}
    </Grid>
  );
}

export default Main;
