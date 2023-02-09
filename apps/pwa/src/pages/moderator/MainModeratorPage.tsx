import { Button, Container, Grid, Stack, styled, Typography } from '@mui/material';
import { CardInsight } from 'components/card-insight';
import Page from 'components/Page';
import useLocales from 'hooks/useLocales';
import { getProposals } from 'queries/commons/getProposal';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';
import { ProjectCard } from '../../components/card-table';
import { moderatorStatistics } from '../../queries/Moderator/stactic';

//
import moment from 'moment';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: '50px',
}));

function MainManagerPage() {
  const navigate = useNavigate();
  const { translate } = useLocales();

  const [stats] = useQuery({
    query: moderatorStatistics,
    variables: {
      start_date: moment().startOf('day').toISOString(),
      end_date: moment().endOf('day').toISOString(),
    },
  });
  const { data: statsData, fetching, error } = stats;

  const [incoming] = useQuery({
    query: getProposals,
    variables: {
      where: {
        outter_status: { _eq: 'ONGOING' },
        _and: { inner_status: { _eq: 'CREATED_BY_CLIENT' } },
      },
    },
  });
  const { data: incomingData, fetching: incomingFetching, error: incomingError } = incoming;

  if (fetching || incomingFetching) return <>... Loading</>;

  return (
    <Page title="Moderator Dashboard">
      <Container>
        <ContentStyle>
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
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h4" sx={{ mb: '20px' }}>
                  {translate('incoming_support_requests')}
                </Typography>
                <Button
                  sx={{
                    backgroundColor: 'transparent',
                    color: '#93A3B0',
                    textDecoration: 'underline',
                    ':hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                  onClick={() => {
                    navigate('/moderator/dashboard/incoming-support-requests');
                  }}
                >
                  {translate('view_all')}
                </Button>
              </Stack>
            </Grid>
            <Grid item md={12} xs={12}>
              <Grid container rowSpacing={3} columnSpacing={3}>
                {incomingData.data.map((item: any, index: any) => (
                  <Grid item md={6} xs={12} key={index}>
                    <ProjectCard
                      title={{ id: item.id }}
                      content={{
                        projectName: item.project_name,
                        organizationName: item.user.client_data.entity ?? '-',
                        sentSection: 'Moderator',
                        employee: item.user.employee_name,
                        createdAtClient: new Date(item.user.client_data.created_at),
                      }}
                      footer={{ createdAt: new Date(item.created_at) }}
                      cardFooterButtonAction="show-details"
                      destination="requests-in-process"
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainManagerPage;
