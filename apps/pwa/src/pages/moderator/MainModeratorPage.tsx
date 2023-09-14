import { Container, Grid, styled } from '@mui/material';
import { CardInsight } from 'components/card-insight';
import Page from 'components/Page';
import useLocales from 'hooks/useLocales';
import { useQuery } from 'urql';
import { moderatorStatistics } from '../../queries/Moderator/stactic';

//
import CardTableByBE from 'components/card-table/CardTableByBE';
import moment from 'moment';
import React from 'react';
import { getTrackList } from 'redux/slices/proposal';
import { dispatch, useSelector } from 'redux/store';
import EmployeeCarousel from 'sections/employee/carousel/EmployeeCarousel';
import useAuth from '../../hooks/useAuth';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: '50px',
}));

function MainManagerPage() {
  const { translate } = useLocales();

  const [stats] = useQuery({
    query: moderatorStatistics,
    variables: {
      start_date: moment().startOf('day').toISOString(),
      end_date: moment().endOf('day').toISOString(),
    },
  });
  const { data: statsData, fetching, error } = stats;

  // using API
  const { activeRole } = useAuth();
  const { loadingCount } = useSelector((state) => state.proposal);

  React.useEffect(() => {
    dispatch(getTrackList(1, activeRole! as string));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole]);

  if (fetching || loadingCount) return <>{translate('pages.common.loading')}</>;

  return (
    // <Page title="Moderator Dashboard">
    <Page title={translate('pages.moderator.main')}>
      <Container>
        <ContentStyle>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <EmployeeCarousel />
            </Grid>
            <Grid item md={12} xs={12}>
              {/* <EmployeeCarousel /> */}
              <CardInsight
                headline={translate('account_manager.heading.daily_stats')}
                data={Object.keys(statsData).map((item) => ({
                  title: translate(`${item}`),
                  value: statsData[`${item}`].aggregate.count,
                }))}
                cardContainerColumns={15}
                cardContainerSpacing={1}
                cardStyle={{ p: 2, bgcolor: 'white' }}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <CardTableByBE
                title={translate('incoming_support_requests')}
                destination="requests-in-process"
                endPoint="tender-proposal/request-in-process"
                limitShowCard={4}
                cardFooterButtonAction="show-details"
                showPagination={false}
                navigateLink="/moderator/dashboard/incoming-support-requests"
              />
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainManagerPage;
