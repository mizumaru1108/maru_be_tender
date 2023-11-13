import { Container, Grid, styled } from '@mui/material';
import { CardInsight } from 'components/card-insight';
import Page from 'components/Page';
import useLocales from 'hooks/useLocales';
import { useQuery } from 'urql';
import { moderatorStatistics } from '../../queries/Moderator/stactic';

//
import CardTableByBE from 'components/card-table/CardTableByBE';
import moment from 'moment';
import React, { useMemo } from 'react';
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
  });
  const { data: statsData, fetching, error } = stats;
  // console.log({ statsData });

  const count = useMemo(() => {
    let totalProject = 0;
    if (statsData && !fetching) {
      totalProject =
        (statsData?.acceptableRequest?.aggregate?.count || 0) +
        (statsData?.incomingNewRequest?.aggregate?.count || 0) +
        (statsData?.rejectedRequest?.aggregate?.count || 0);
    }
    return totalProject;
  }, [statsData, fetching]);

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
                  value: item !== 'totalRequest' ? statsData[`${item}`].aggregate.count : count,
                  redirect_link:
                    item === 'incomingNewRequest'
                      ? '/moderator/dashboard/incoming-support-requests'
                      : '/moderator/dashboard/previous-funding-requests',
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
