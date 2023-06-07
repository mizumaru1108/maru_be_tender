import { Grid } from '@mui/material';
import DailyStatistics from './DailyStatistics';
import IncomingFundingRequests from './IncomingFundingRequests';
import ExchangePermission from './ExchangePermission';
import RequestsInProcess from './RequestsInProcess';
import ProposalOnAmandement from './ProposalOnAmandement';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
// urql + query
import { useQuery } from 'urql';
import { getOneEmployee } from 'queries/admin/getAllTheEmployees';
import TrackBudget from 'sections/project-manager/main/TrackBudget';

function Main() {
  const { translate } = useLocales();
  const { user } = useAuth();

  const [{ data, fetching, error }] = useQuery({
    query: getOneEmployee,
    variables: { id: user?.id },
  });

  if (fetching) return <>{translate('pages.common.loading')}</>;
  if (error) return <>{error.message}</>;

  return (
    <Grid container spacing={4}>
      <Grid item md={12}>
        <DailyStatistics />
      </Grid>
      <Grid item md={12}>
        <TrackBudget path={data.data.employee_path} track_id={data.data.track_id} />
      </Grid>
      <IncomingFundingRequests />
      <RequestsInProcess />
      <ExchangePermission />
      {/* <ProposalOnAmandement /> */}
    </Grid>
  );
}

export default Main;
