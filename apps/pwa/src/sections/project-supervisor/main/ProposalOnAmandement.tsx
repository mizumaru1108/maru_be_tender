import { Box, Grid, Typography } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import EmptyContent from 'components/EmptyContent';
import SortingCardTable from 'components/sorting/sorting';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React from 'react';
import axiosInstance from 'utils/axios';
import { FEATURE_MENU_ADMIN_APLICATION_ADMISSION } from '../../../config';
import useAuth from '../../../hooks/useAuth';
import { getApplicationAdmissionSettings } from '../../../redux/slices/applicationAndAdmissionSettings';
import { dispatch, useSelector } from '../../../redux/store';
import { generateHeader } from '../../../utils/generateProposalNumber';
import LoadingPage from '../../client/dashboard/LoadingPage';

function ProposalOnAmandement() {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();

  // Redux
  const { isLoading: isFetchingData, error: errorFetchingData } = useSelector(
    (state) => state.applicationAndAdmissionSettings
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const [cardData, setCardData] = React.useState([]);
  const [tmpCardData, setTmpCardData] = React.useState([]);
  const [sortingFilter, setSortingFilter] = React.useState('');

  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(
        `tender-proposal/amandement-lists?limit=4${sortingFilter}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      // console.log('test', rest.data.data);
      if (rest) {
        setCardData(
          rest.data.data
            .filter((item: any) => item.proposal.outter_status === 'ON_REVISION')
            .map((item: any) => ({
              ...item.proposal,
              user: {
                employee_name: item.user.employee_name,
              },
            }))
        );
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

  React.useEffect(() => {
    // fetchingIncoming();
    if (cardData.length > 0) {
      const tmpVal: any = cardData.map((item: any) => {
        if (item.proposal) {
          return { ...item.proposal, ...item.user };
        }
        return { ...item, user: item.user };
      });
      if (tmpVal.length > 0) {
        setTmpCardData(tmpVal);
      }
      // setTmpCardData((prev: any) => [...prev, ...cardData]);
    }
  }, [cardData]);

  React.useEffect(() => {
    dispatch(getApplicationAdmissionSettings(activeRole!));
  }, [activeRole]);

  if (isLoading || isFetchingData) {
    return <LoadingPage />;
  }
  if (errorFetchingData && FEATURE_MENU_ADMIN_APLICATION_ADMISSION)
    return (
      <>
        {' '}
        <EmptyContent
          title="لا يوجد بيانات"
          img="/assets/icons/confirmation_information.svg"
          description={`${translate('errors.something_wrong')}`}
          errorMessage={errorFetchingData?.message || undefined}
          sx={{
            '& span.MuiBox-root': { height: 160 },
          }}
        />
      </>
    );
  return (
    <Grid item md={12}>
      <Grid container>
        <Grid item md={10}>
          <Box>
            <Typography variant="h4" sx={{ mb: '20px' }}>
              {translate('amandement_requests_project_supervisor')}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={2}>
          <SortingCardTable
            isLoading={isLoading}
            onChangeSorting={(event: string) => {
              setSortingFilter(event);
            }}
          />
        </Grid>
      </Grid>
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
            // navigate('/project-supervisor/dashboard/incoming-funding-requests');
          }}
        >
          {translate('view_all')}
        </Button> */}
      <Grid container spacing={2}>
        {isLoading && translate('pages.common.loading')}
        {!isLoading && tmpCardData && tmpCardData.length > 0 ? (
          tmpCardData.map((item: any, index: any) => (
            <Grid item md={6} key={index}>
              <ProjectCard
                title={{
                  id: item.id,
                  project_number: generateHeader(
                    item && item.project_number && item.project_number
                      ? item.project_number
                      : item.id
                  ),
                  inquiryStatus:
                    (item && item.outter_status && item.outter_status.toLowerCase()) || undefined,
                }}
                content={{
                  projectName: item.project_name,
                  organizationName: (item && item.user && item.user.employee_name) ?? '-',
                  sentSection: item.state,
                  // employee: item.user.employee_name,
                  employee:
                    item.proposal_logs &&
                    item.proposal_logs.length > 0 &&
                    item.proposal_logs[item.proposal_logs.length - 1].reviewer &&
                    item.proposal_logs[item.proposal_logs.length - 1].reviewer.employee_name,
                  // createdAtClient: new Date(item.user.client_data.created_at),
                  createdAtClient: new Date(item.created_at),
                }}
                footer={{ createdAt: new Date(item.updated_at) }}
                // cardFooterButtonAction="show-project"
                cardFooterButtonAction={
                  item.outter_status === 'ON_REVISION' ? 'show-project' : 'show-details'
                }
                destination="requests-in-process"
              />
            </Grid>
          ))
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

export default ProposalOnAmandement;
