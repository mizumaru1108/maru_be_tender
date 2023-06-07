import { Grid } from '@mui/material';
import useAuth from 'hooks/useAuth';
import TrackBudget from 'sections/admin/main/TrackBudget';
import DailyStatistics from './DailyStatistics';
import DashboardProjectManagement from './ProjectManagement';

function CeoDashboard() {
  // const { translate } = useLocales();
  // const { isLoading } = useSelector((state) => state.proposal);
  const activeRole = useAuth();
  // const { user } = useAuth();
  const role = activeRole!.activeRole;

  // const [{ data, fetching, error }] = useQuery({
  //   query: getOneEmployee,
  //   variables: { id: user?.id },
  // });

  // useEffect(() => {
  //   dispatch(getTrackList(0, role as string));
  // }, [activeRole, role]);

  // if (fetching || isLoading) return <>{translate('pages.common.loading')}</>;
  // if (error) return <>{error.message}</>;

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
        {/* <Grid item md={12}>
          <ProposalOnAmandementTable />
        </Grid> */}
      </Grid>
    </>
  );
}

export default CeoDashboard;
