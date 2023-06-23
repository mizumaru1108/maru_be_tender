import { Grid } from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { getOneEmployee } from 'queries/admin/getAllTheEmployees';
import TrackBudget from 'sections/cashier/main/TrackBudget';
import { useQuery } from 'urql';
import DailyStatistics from './DailyStatistics';
import IncomingExchangePermissionRequests from './IncomingExchangePermissionRequests';
import RequestsInProcess from './RequestsInProcess';

function Main() {
  // const { translate } = useLocales();
  // const { user } = useAuth();

  // const [{ data, fetching, error }] = useQuery({
  //   query: getOneEmployee,
  //   variables: { id: user?.id },
  // });

  // if (fetching) return <>{translate('pages.common.loading')}</>;
  // if (error) return <>{error.message}</>;
  return (
    <Grid container spacing={4}>
      <Grid item md={12} xs={12}>
        <DailyStatistics />
      </Grid>
      {/* <Grid item md={12}>
        <TrackBudget path={data.data.employee_path} track_id={data.data.track_id} />
      </Grid> */}
      <Grid item md={12} xs={12}>
        <IncomingExchangePermissionRequests />
      </Grid>
      <Grid item md={12} xs={12}>
        <RequestsInProcess />
      </Grid>
    </Grid>
  );
}

export default Main;
