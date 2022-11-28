import { Grid } from '@mui/material';
import Page500 from 'pages/Page500';
import { clientMainPage } from 'queries/client/clientMainPage';
import { useQuery } from 'urql';
import ClientCarousel from './ClientCarousel';
import CurrentProjects from './CurrentProjects';
import DraftProject from './DraftProject';
import LoadingPage from './LoadingPage';
import PreviousFundingInqueries from './PreviousFundingInqueries';

function DashboardPage() {
  const [result, mutate] = useQuery({
    query: clientMainPage,
  });
  const { data, fetching, error } = result;

  if (fetching) return <LoadingPage />;
  if (error) return <Page500 error={error.message} />;
  return (
    <Grid container rowSpacing={8}>
      <Grid item md={12} xs={12}>
        <ClientCarousel />
      </Grid>
      {data && (
        <>
          <Grid item md={12} xs={12}>
            <CurrentProjects current_projects={data.current_projects} />
          </Grid>
          {data.draft_projects.length !== 0 && (
            <Grid item md={12} xs={12}>
              <DraftProject draft_projects={data.draft_projects} mutate={mutate} />
            </Grid>
          )}
          <Grid item md={12} xs={12}>
            <PreviousFundingInqueries
              completed_client_projects={data.completed_client_projects}
              pending_client_projects={data.pending_client_projects}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default DashboardPage;
