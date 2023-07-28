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
import React from 'react';
import { dispatch, useSelector } from 'redux/store';
import { getTrackList } from 'redux/slices/proposal';
import useAuth from 'hooks/useAuth';

function DashboardPage() {
  const { activeRole } = useAuth();
  const [result, mutate] = useQuery({
    query: clientMainPage,
  });
  const { data, fetching, error } = result;
  const { loadingCount } = useSelector((state) => state.proposal);

  React.useEffect(() => {
    dispatch(getTrackList(1, activeRole! as string));
  }, [activeRole]);

  if (fetching || loadingCount) return <LoadingPage />;
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
          {/* {data.amandement_proposal.length ? (
           
          ) : null} */}
          <Grid item md={12} xs={12}>
            <ListAmandementRequest />
          </Grid>
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
