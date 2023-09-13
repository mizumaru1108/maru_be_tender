import { Typography, Grid, Box, Stack } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import useAuth from 'hooks/useAuth';
import { getProposals } from 'queries/commons/getProposal';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
import { generateHeader } from '../../../utils/generateProposalNumber';
import React from 'react';
import { useSnackbar } from 'notistack';
import axiosInstance from 'utils/axios';
import EmptyContent from 'components/EmptyContent';
import SortingCardTable from 'components/sorting/sorting';

function RequestsInProcess() {
  const { translate } = useLocales();
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  const [cardData, setCardData] = React.useState([]);
  const [sortingFilter, setSortingFilter] = React.useState('');

  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(
        `tender-proposal/request-in-process?limit=4&type=inprocess${sortingFilter}`,
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
  }, [activeRole, enqueueSnackbar, sortingFilter]);

  React.useEffect(() => {
    fetchingIncoming();
  }, [fetchingIncoming]);

  return (
    <Grid item md={12}>
      {/* <Typography variant="h4" sx={{ mb: '20px' }}>
        {translate('content.client.main_page.process_request')}
      </Typography> */}
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4" sx={{ mb: '20px' }}>
          {translate('content.client.main_page.process_request')}
        </Typography>
        <Box>
          <SortingCardTable
            isLoading={isLoading}
            onChangeSorting={(event: string) => {
              setSortingFilter(event);
            }}
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
                  // employee: item.user.employee_name,
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

export default RequestsInProcess;
