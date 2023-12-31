import { Box, Grid, Stack, Typography } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useNavigate } from 'react-router';
import EmptyContent from '../../../components/EmptyContent';
import SortingCardTable from '../../../components/sorting/sorting';
import { FEATURE_MENU_ADMIN_APLICATION_ADMISSION } from '../../../config';
import useAuth from '../../../hooks/useAuth';
import { getApplicationAdmissionSettings } from '../../../redux/slices/applicationAndAdmissionSettings';
import { dispatch, useSelector } from '../../../redux/store';
import axiosInstance from '../../../utils/axios';
import { generateHeader } from '../../../utils/generateProposalNumber';
import LoadingPage from '../../client/dashboard/LoadingPage';

function IncomingAmandementRequest() {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { user, activeRole } = useAuth();

  // Redux
  const { isLoading: isFetchingData, error: errorFetchingData } = useSelector(
    (state) => state.applicationAndAdmissionSettings
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [cardData, setCardData] = React.useState([]);
  const [sortingFilter, setSortingFilter] = React.useState('');

  // console.log({ cardData });
  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(
        `tender-proposal/amandement-request-lists?limit=4&status=PENDING&include_relations=supervisor,sender,proposal${sortingFilter}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      // console.log('test', rest.data.data);
      if (rest.data.data) {
        // setCardData(
        //   rest.data.data
        //     // .filter((item: any) => item.proposal.outter_status === 'ON_REVISION')
        //     .map((item: any) => ({
        //       ...item,
        //     }))
        // );
        setCardData(rest.data.data);
      }
    } catch (err) {
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(
        `${
          statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
        }`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar, sortingFilter]);

  React.useEffect(() => {
    fetchingIncoming();
  }, [fetchingIncoming]);
  // const [result] = useQuery({
  //   query: getProposals,
  //   variables: {
  //     limit: 4,
  //     order_by: { updated_at: 'desc' },
  //     where: {
  //       supervisor_id: { _eq: user?.id },
  //       _and: {
  //         outter_status: {
  //           _eq: 'ASKED_FOR_AMANDEMENT',
  //         },
  //       },
  //     },
  //   },
  // });
  // const { data, fetching, error } = result;
  // if (fetching) {
  //   return (
  //     <Grid item md={12}>
  //       {translate('pages.common.loading')}
  //     </Grid>
  //   );
  // }
  // const props = data?.data ?? [];
  // if (!props || props.length === 0) return null;
  // console.log({ cardData });

  // React.useEffect(() => {
  //   dispatch(getApplicationAdmissionSettings(activeRole!));
  // }, [activeRole]);

  if (isLoading || isFetchingData) {
    return <LoadingPage />;
  }
  // if (errorFetchingData && FEATURE_MENU_ADMIN_APLICATION_ADMISSION)
  //   return (
  //     <>
  //       {' '}
  //       <EmptyContent
  //         title="لا يوجد بيانات"
  //         img="/assets/icons/confirmation_information.svg"
  //         description={`${translate('errors.something_wrong')}`}
  //         errorMessage={errorFetchingData?.message || undefined}
  //         sx={{
  //           '& span.MuiBox-root': { height: 160 },
  //         }}
  //       />
  //     </>
  //   );

  return (
    <Grid item md={12}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4" sx={{ mb: '20px' }}>
          {translate('incoming_amandement_requests')}
        </Typography>
        <Box>
          <SortingCardTable
            isLoading={isLoading}
            onChangeSorting={(event: string) => {
              setSortingFilter(event);
            }}
            // limit={4}
            // api={'tender-proposal/amandement-request-lists'}
            // returnData={setCardData}
            // loadingState={setIsLoading}
          />
          {/* <Button
            sx={{
              backgroundColor: 'transparent',
              color: '#93A3B0',
              textDecoration: 'underline',
              ':hover': {
                backgroundColor: 'transparent',
              },
            }}
            onClick={() => {
              navigate('/project-supervisor/dashboard/incoming-amandment-requests');
            }}
          >
            {translate('view_all')}
          </Button> */}
        </Box>
      </Stack>
      <Grid container spacing={2}>
        {isLoading && translate('pages.common.loading')}
        {!isLoading && cardData && cardData.length > 0 ? (
          cardData.map((item: any, index: any) => {
            const tmpItem = item;
            if (tmpItem && tmpItem?.proposal && tmpItem?.sender) {
              return (
                <Grid item md={6} key={index}>
                  <ProjectCard
                    title={{
                      id: item?.proposal?.id || '-',
                      project_number: generateHeader(
                        item && item.proposal.project_number && item.proposal.project_number
                          ? item.proposal.project_number
                          : item.id
                      ),
                      inquiryStatus:
                        (item &&
                          item.proposal.outter_status &&
                          item.proposal.outter_status.toLowerCase()) ||
                        undefined,
                    }}
                    content={{
                      projectName: item.proposal.project_name || '-',
                      organizationName: item.sender.employee_name || '-',
                      sentSection: item.proposal.state,
                      // employee: item.user.employee_name,
                      employee: item.sender.employee_name,
                      // createdAtClient: new Date(item.user.client_data.created_at),
                      createdAtClient: item.proposal.created_at
                        ? new Date(item.proposal.created_at)
                        : new Date(),
                    }}
                    footer={{
                      createdAt: item.updated_at ? new Date(item.updated_at) : new Date(),
                    }}
                    // cardFooterButtonAction="show-project"
                    cardFooterButtonAction={
                      item.proposal.outter_status === 'ASKED_FOR_AMANDEMENT'
                        ? 'show-details'
                        : 'show-project'
                    }
                    destination="incoming-amandment-requests"
                  />
                </Grid>
              );
            }
            return null;
          })
        ) : (
          <Grid item md={12}>
            <EmptyContent
              title="لا يوجد بيانات"
              sx={{
                '& span.MuiBox-root': { height: 160 },
              }}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default IncomingAmandementRequest;
