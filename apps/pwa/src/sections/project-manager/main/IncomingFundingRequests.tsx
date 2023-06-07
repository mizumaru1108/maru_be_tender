import { Typography, Grid, Box, Stack } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { getProposals } from 'queries/commons/getProposal';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
import { generateHeader } from '../../../utils/generateProposalNumber';
import React from 'react';
import { useSnackbar } from 'notistack';
import useAuth from '../../../hooks/useAuth';
import axiosInstance from '../../../utils/axios';
import EmptyContent from '../../../components/EmptyContent';
import SortingCardTable from 'components/sorting/sorting';

function IncomingFundingRequests() {
  const { translate } = useLocales();
  const [result] = useQuery({
    query: getProposals,
    variables: {
      order_by: { updated_at: 'desc' },
      limit: 4,
      offset: 0,
      where: {
        project_manager_id: { _is_null: true },
        _and: {
          inner_status: { _in: ['ACCEPTED_BY_SUPERVISOR'] },
          outter_status: { _nin: ['ON_REVISION', 'ASKED_FOR_AMANDEMENT'] },
        },
      },
    },
  });
  const { data, fetching, error } = result;

  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  const [cardData, setCardData] = React.useState([]);

  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(
        `tender-proposal/request-in-process?limit=4&type=incoming`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
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
  }, [activeRole, enqueueSnackbar]);

  React.useEffect(() => {
    fetchingIncoming();
  }, [fetchingIncoming]);

  if (fetching) {
    return (
      <Grid item md={12}>
        {translate('pages.common.loading')}
      </Grid>
    );
  }
  // const props = data?.data ?? [];
  // if (!cardData || cardData.length === 0) return null;
  return (
    <Grid item md={12}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4" sx={{ mb: '20px' }}>
          {translate('incoming_funding_requests_project_supervisor')}
        </Typography>
        <Box>
          <SortingCardTable
            limit={4}
            type={'incoming'}
            isLoading={isLoading}
            api={'tender-proposal/request-in-process'}
            returnData={setCardData}
            loadingState={setIsLoading}
          />
        </Box>
      </Stack>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {isLoading && translate('pages.common.loading')}
        {!isLoading && cardData.length > 0 ? (
          cardData?.map((item: any, index: any) => (
            <Grid item md={6} key={index}>
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
                  employee:
                    item.proposal_logs &&
                    item.proposal_logs.length > 0 &&
                    item.proposal_logs[item.proposal_logs.length - 1].reviewer &&
                    item.proposal_logs[item.proposal_logs.length - 1].reviewer.employee_name,
                  createdAtClient: new Date(item.created_at),
                }}
                footer={{
                  createdAt: new Date(item.updated_at),
                }}
                cardFooterButtonAction="show-details"
                destination="incoming-funding-requests"
              />
            </Grid>
          ))
        ) : (
          <Grid item md={12}>
            {/* {'test'} */}
            <EmptyContent
              title="No Data"
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

export default IncomingFundingRequests;
