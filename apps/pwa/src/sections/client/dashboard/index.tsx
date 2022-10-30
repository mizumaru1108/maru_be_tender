import { Grid } from '@mui/material';
import useAuth from 'hooks/useAuth';
import { checkClientStatus } from 'queries/client/checkClientStatus';
import { useQuery } from 'urql';
import ClientCarousel from './ClientCarousel';
import CurrentProject from './CurrentProject';
import DraftProject from './DraftProject';
import PreviousFundingInqueries from './PreviousFundingInqueries';
import UnActivatedAccount from './UnActivatedAccount';

function DashboardPage() {
  const { user } = useAuth();
  const { id } = user!;
  const [result] = useQuery({
    query: checkClientStatus,
    variables: { id },
  });
  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  if (data?.user_by_pk?.client_data[0]?.status === 'WAITING_FOR_ACTIVATION')
    return <UnActivatedAccount />;
  return (
    <Grid container rowSpacing={8}>
      <Grid item md={12} xs={12}>
        <ClientCarousel />
      </Grid>
      <Grid item md={12} xs={12}>
        <CurrentProject />
      </Grid>
      <Grid item md={12} xs={12}>
        <DraftProject />
      </Grid>
      <Grid item md={12} xs={12}>
        <PreviousFundingInqueries />
      </Grid>
    </Grid>
  );
}

export default DashboardPage;
