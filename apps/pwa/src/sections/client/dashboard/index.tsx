import { Grid } from '@mui/material';
import Page500 from 'pages/Page500';
import { clientMainPage } from 'queries/client/clientMainPage';
import { useQuery } from 'urql';
import ClientCarousel from './ClientCarousel';
import CurrentProjects from './CurrentProjects';
import DraftProject from './DraftProject';
import ListAmandementRequest from './ListAmandementRequest';
import LoadingPage from './LoadingPage';
import PreviousFundingInqueries from './PreviousFundingInqueries';
import Statistic from './Statistic';
import IncomingClientCloseReport from './IncomingClientCloseReport';

function DashboardPage() {
  const [result, mutate] = useQuery({
    query: clientMainPage,
  });
  const { data, fetching, error } = result;

  if (fetching) return <LoadingPage />;
  if (error) return <Page500 error={error.message} />;
  return (
    <Grid container rowSpacing={6}>
      <Grid item md={12} xs={12}>
        <ClientCarousel />
      </Grid>
      <Grid item md={12} xs={12}>
        <Statistic />
      </Grid>
      {data && (
        <>
          <Grid item md={12} xs={12}>
            <CurrentProjects current_projects={data.current_projects} />
          </Grid>
          {data.draft_projects.length ? (
            <Grid item md={12} xs={12}>
              <DraftProject draft_projects={data.draft_projects} mutate={mutate} />
            </Grid>
          ) : null}
          {data.amandement_proposal.length ? (
            <Grid item md={12} xs={12}>
              <ListAmandementRequest />
            </Grid>
          ) : null}
          <Grid item md={12} xs={12}>
            <IncomingClientCloseReport />
          </Grid>
          <Grid item md={12} xs={12}>
            <PreviousFundingInqueries
              completed_client_projects={data.completed_client_projects}
              pending_client_projects={data.pending_client_projects}
              amandement_proposal={data.amandement_proposal}
              all_client_projects={data.all_client_projects}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default DashboardPage;
