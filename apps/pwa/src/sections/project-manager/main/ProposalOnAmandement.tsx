import { Typography, Grid, Box, Stack } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import useAuth from 'hooks/useAuth';
import { getProposals } from 'queries/commons/getProposal';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
import { generateHeader } from '../../../utils/generateProposalNumber';
import { useSnackbar } from 'notistack';
import React from 'react';
import axiosInstance from 'utils/axios';
import SortingCardTable from 'components/sorting/sorting';

function ProposalOnAmandement() {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(false);
  const { activeRole } = useAuth();
  const [cardData, setCardData] = React.useState([]);
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
    // fetchingPrevious();
  }, [fetchingIncoming]);

  return (
    <Grid item md={12}>
      {/* <Typography variant="h4" sx={{ mb: '20px' }}>
        {translate('amandement_requests_project_supervisor')}
      </Typography> */}
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4" sx={{ mb: '20px' }}>
          {translate('amandement_requests_project_supervisor')}
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
        {!isLoading &&
          cardData.length > 0 &&
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
                cardFooterButtonAction="show-project"
                destination="requests-in-process"
              />
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
}

export default ProposalOnAmandement;
