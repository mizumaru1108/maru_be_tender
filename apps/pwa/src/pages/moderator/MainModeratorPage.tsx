import { Box, Button, Container, Grid, Stack, styled, Typography } from '@mui/material';
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
import { generateHeader } from '../../utils/generateProposalNumber';
import { useSnackbar } from 'notistack';
import useAuth from '../../hooks/useAuth';
import React from 'react';
import axiosInstance from '../../utils/axios';
import SortingCardTable from 'components/sorting/sorting';
import EmployeeCarousel from 'sections/employee/carousel/EmployeeCarousel';

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
      order_by: { updated_at: 'desc' },
      where: {
        outter_status: { _eq: 'ONGOING' },
        _and: { inner_status: { _eq: 'CREATED_BY_CLIENT' } },
      },
    },
  });
  const { data: incomingData, fetching: incomingFetching, error: incomingError } = incoming;

  // using API
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  const [cardData, setCardData] = React.useState([]);

  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(`tender-proposal/request-in-process?limit=4`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (rest) {
        // console.log('rest total :', rest.data.total);
        setCardData(
          rest.data.data.map((item: any) => ({
            ...item,
          }))
        );
      }
    } catch (err) {
      // console.log('err', err);
      // enqueueSnackbar(err.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      //   anchorOrigin: {
      //     vertical: 'bottom',
      //     horizontal: 'center',
      //   },
      // });
      // handle error fetching
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(err.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar]);

  React.useEffect(() => {
    fetchingIncoming();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchingIncoming]);

  if (fetching || incomingFetching) return <>{translate('pages.common.loading')}</>;
  // console.log({ isLoading });
  // if (isLoading) return <>{translate('pages.common.loading')}</>;

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
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h4" sx={{ mb: '20px' }}>
                  {translate('incoming_support_requests')}
                </Typography>
                <Box>
                  <SortingCardTable
                    isLoading={isLoading}
                    limit={4}
                    api={'tender-proposal/request-in-process'}
                    returnData={setCardData}
                    loadingState={setIsLoading}
                  />
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
                </Box>
              </Stack>
            </Grid>
            <Grid item md={12} xs={12}>
              <Grid container rowSpacing={3} columnSpacing={3}>
                {isLoading && translate('pages.common.loading')}
                {!isLoading &&
                  cardData.map((item: any, index: any) => (
                    <Grid item md={6} xs={12} key={index}>
                      <ProjectCard
                        title={{
                          id: item.id,
                          project_number: generateHeader(
                            item && item.project_number && item.project_number
                              ? item.project_number
                              : item.id
                          ),
                          inquiryStatus: item.outter_status.toLowerCase(),
                        }}
                        content={{
                          projectName: item.project_name,
                          organizationName: (item && item.user && item.user.employee_name) ?? '-',
                          sentSection: item.state,
                          employee: item.user.employee_name,
                          createdAtClient: new Date(item.created_at),
                        }}
                        footer={{
                          createdAt: new Date(item.updated_at),
                        }}
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
