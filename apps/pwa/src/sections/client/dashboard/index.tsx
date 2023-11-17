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
import Space from 'components/space/space';

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
      <CurrentProjects />
      <Space direction="horizontal" size="small" />
      {data && (
        <>
          {data.draft_projects.length ? (
            <Grid item md={12} xs={12}>
              <DraftProject draft_projects={data.draft_projects} mutate={mutate} />
            </Grid>
          ) : null}
          <Grid item md={12} xs={12}>
            <ListAmandementRequest />
          </Grid>
          <Grid item md={12} xs={12}>
            <IncomingClientCloseReport />
          </Grid>
        </>
      )}
      <PreviousFundingInqueries />
    </Grid>
  );
}

export default DashboardPage;
